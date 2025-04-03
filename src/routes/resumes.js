const express = require('express');
const multer = require('multer');
const User = require('../models/User');
const ResumeProcessor = require('../services/resumeProcessor');
const CloudinaryService = require('../services/cloudinaryService');
const SkillExtractor = require('../services/skillExtractor');
const LinkedinService = require('../services/linkedinService');
const auth = require('../middleware/auth');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

router.post('/upload',
  auth,
  upload.single('resume'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ error: 'Invalid file type. Only PDF and DOCX are allowed.' });
      }

      const file = req.file;
      const fileUrl = await CloudinaryService.uploadFile(file);
      const resumeText = await ResumeProcessor.extractText(file);
      const skills = await SkillExtractor.extractSkills(resumeText);

      const user = await User.findByIdAndUpdate(
        req.user.userId,
        {
          resumeUrl: fileUrl,
          resumeText: resumeText,
          skills: skills
        },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ fileUrl, skills });
    } catch (error) {
      console.error('Resume upload error:', error);
      if (error.message.includes('File too large')) {
        return res.status(413).json({ error: 'File too large. Maximum size is 5MB.' });
      }
      next(error);
    }
  }
);

router.post('/linkedin',
  auth,
  async (req, res, next) => {
    try {
      const { url, saveToProfile } = req.body;

      if (!url) {
        return res.status(400).json({ error: 'LinkedIn URL is required' });
      }

      // Validate URL format
      if (!url.match(/^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/)) {
        return res.status(400).json({
          error: 'Invalid LinkedIn URL format. Please provide a valid profile URL.'
        });
      }

      const skills = await LinkedinService.extractSkills(url);

      if (skills.length === 0) {
        return res.status(404).json({
          error: 'No skills found in the LinkedIn profile'
        });
      }

      if (saveToProfile) {
        // Update user's skills in database
        await User.findByIdAndUpdate(
          req.user.userId,
          {
            $addToSet: { skills: { $each: skills } }
          },
          { new: true }
        );
      }

      // Track API usage
      console.log(`LinkedIn API called for user ${req.user.userId} at ${new Date().toISOString()}`);

      res.json({
        skills,
        message: 'Skills successfully extracted',
        count: skills.length
      });

    } catch (error) {
      console.error('LinkedIn API Error:', error);
      next(error);
    }
  }
);

module.exports = router;
