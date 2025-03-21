const express = require('express');
const { body, validationResult } = require('express-validator');
const Job = require('../models/Job');
const User = require('../models/User');
const auth = require('../middleware/auth');
const SkillExtractor = require('../services/skillExtractor');
const router = express.Router();

// Protect all routes
router.use(auth);

router.get('/recommendations', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const user = await User.findById(req.user.userId);
    const jobs = await Job.find();

    const scoredJobs = jobs.map(job => ({
      ...job.toObject(),
      score: SkillExtractor.calculateOverallMatch(
        user.skills,
        job.skills,
        user.resumeText,
        job.description
      )
    }));

    const filteredJobs = scoredJobs.filter(job => job.score > 0.2);
    const sortedJobs = filteredJobs.sort((a, b) => b.score - a.score);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {
      jobs: sortedJobs.slice(startIndex, endIndex),
      pagination: {
        total: filteredJobs.length,
        pages: Math.ceil(filteredJobs.length / limit),
        currentPage: page
      }
    };

    res.json(results);
  } catch (error) {
    next(error);
  }
});

router.post('/', [
  body('title').trim().notEmpty(),
  body('company').trim().notEmpty(),
  body('description').trim().notEmpty(),
  body('skills').isArray()
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().sort('-createdAt');
    res.json(jobs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
