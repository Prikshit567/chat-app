// backend/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: 'User already exists' });

    const hash = await bcrypt.hash(password, 10);

    const user = new User({ username, email, password: hash });
    await user.save();

    res.status(200).json({ msg: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Error in registration', error: err.message });
  }
};

const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ msg: 'User not found' });
  
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(400).json({ msg: 'Invalid credentials' });
  
      console.log("JWT_SECRET from env:", process.env.JWT_SECRET);

      
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });
  
      res.json({
        token,
        user: { id: user._id, username: user.username, email: user.email }
      });
    } catch (err) {
      res.status(500).json({ msg: 'Error in login', error: err.message });
    }
  };
  

module.exports = { register, login };
