const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token });
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

module.exports = router;
