const express = require('express');
const multer = require('multer');
const User = require('../models/User');
const ResumeProcessor = require('../services/resumeProcessor');
const CloudinaryService = require('../services/cloudinaryService');
const SkillExtractor = require('../services/skillExtractor');
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

module.exports = router;
