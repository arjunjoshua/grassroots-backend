const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/', async (req, res) => {
  const { username, password, email } = req.body;
  
  // Check if user already exists
  let user = await User.findOne({ $or: [{ username }, { email }] });
  if (user) {
    return res.status(400).json({ message: 'User already exists' });
  }
  
  // Create new user
  user = new User({
    username,
    password,
    email,
  });
  
  // Save the user and return response
  await user.save();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ status: 'success', token, username, userID: user._id });
});

module.exports = router;
