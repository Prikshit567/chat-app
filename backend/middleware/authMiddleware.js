// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

// For Socket.IO authentication
const verifySocketUser = (socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) return next(new Error('Authentication token missing'));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
};

// ✅ Add this for HTTP route protection
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  if (!token) return res.status(401).json({ message: 'Access token missing' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contains id and possibly other info
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = { verifySocketUser, verifyToken };
