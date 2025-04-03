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
      const { url } = req.body;

      if (!url) {
        return res.status(400).json({ error: 'LinkedIn URL is required' });
      }

      // Validate URL format
      if (!url.match(/^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/)) {
        return res.status(400).json({
          error: 'Invalid LinkedIn URL format. Please provide a valid profile URL.'
        });
      }

      console.log('Processing LinkedIn URL:', url);
      const skills = await LinkedinService.extractSkills(url);

      // Log successful API call
      console.log('LinkedIn API Success:', {
        userId: req.user.userId,
        skillsCount: skills.length,
        timestamp: new Date().toISOString()
      });

      if (skills.length === 0) {
        return res.status(404).json({
          error: 'No skills found in the LinkedIn profile'
        });
      }

      // Update user's skills in database
      const user = await User.findByIdAndUpdate(
        req.user.userId,
        {
          $addToSet: { skills: { $each: skills } }
        },
        { new: true }
      );

      res.json({
        success: true,
        skills,
        message: 'Skills successfully extracted',
        count: skills.length,
        updatedUserSkills: user.skills
      });

    } catch (error) {
      console.error('LinkedIn Extraction Error:', {
        userId: req.user.userId,
        url: req.body.url,
        error: error.message,
        stack: error.stack
      });

      // Send more specific error messages to client
      res.status(error.response?.status || 500).json({
        error: error.message || 'Failed to extract skills from LinkedIn profile',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
);

module.exports = router;
