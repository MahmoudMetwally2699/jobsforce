const express = require('express');
const multer = require('multer');
const User = require('../models/User');
const ResumeProcessor = require('../services/resumeProcessor');
const CloudinaryService = require('../services/cloudinaryService');
const auth = require('../middleware/auth');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload',
  auth,
  upload.single('resume'),
  (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ error: 'Invalid file type' });
    }

    next();
  },
  async (req, res, next) => {
    try {
      const file = req.file;
      const fileUrl = await CloudinaryService.uploadFile(file);
      const resumeText = await ResumeProcessor.extractText(file);
      const skills = await SkillExtractor.extractSkills(resumeText);

      await User.findByIdAndUpdate(req.user.userId, {
        resumeUrl: fileUrl,
        resumeText: resumeText,
        skills: skills
      });

      res.json({ fileUrl, skills });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
