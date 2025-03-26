const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// User signup
router.post('/user/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = new User({
      email,
      password,
      role: 'user'
    });
    await user.save();
    const token = jwt.sign({ userId: user._id, role: 'user' }, process.env.JWT_SECRET);
    res.status(201).json({ token, role: 'user' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Recruiter signup
router.post('/recruiter/signup', async (req, res) => {
  try {
    const { email, password, companyName } = req.body;
    if (!companyName) {
      return res.status(400).json({ error: 'Company name is required' });
    }
    const user = new User({
      email,
      password,
      role: 'recruiter',
      companyName
    });
    await user.save();
    const token = jwt.sign({ userId: user._id, role: 'recruiter' }, process.env.JWT_SECRET);
    res.status(201).json({ token, role: 'recruiter' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// User login
router.post('/user/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email, role: 'user' });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id, role: 'user' }, process.env.JWT_SECRET);
    res.json({ token, role: 'user' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Recruiter login
router.post('/recruiter/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email, role: 'recruiter' });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id, role: 'recruiter' }, process.env.JWT_SECRET);
    res.json({ token, role: 'recruiter' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create test account route
router.post('/test-account', async (req, res) => {
  try {
    const testUser = new User({
      email: 'test@example.com',
      password: 'test1234'
    });
    await testUser.save();
    const token = jwt.sign({ userId: testUser._id }, process.env.JWT_SECRET);
    res.status(201).json({
      message: 'Test account created',
      credentials: {
        email: 'test@example.com',
        password: 'test1234'
      },
      token
    });
  } catch (error) {
    res.status(400).json({ error: 'Test account already exists' });
  }
});

// Add middleware to check if user is recruiter
const isRecruiter = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user.role !== 'recruiter') {
      return res.status(403).json({ error: 'Access denied. Recruiters only.' });
    }
    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Export just the router by default and isRecruiter as a named export
router.isRecruiter = isRecruiter;
module.exports = router;
