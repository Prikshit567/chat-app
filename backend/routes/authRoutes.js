// backend/routes/authRoutes.js
const express = require('express');
const { register, login } = require('../controller/authController');
const { verifyToken } = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/users', verifyToken, async (req, res) => {
    try {
      const users = await User.find({ _id: { $ne: req.user.id } }).select('username email _id');
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
  });

module.exports = router;
