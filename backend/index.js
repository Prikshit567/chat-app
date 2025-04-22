const express = require("express");
const mongoose = require("mongoose");
const http = require('http');
const cors = require('cors');
require('dotenv').config({ path: './config.env' });
const { Server } = require('socket.io');

const authRoutes = require("./routes/authRoutes");
const Message = require("./models/Message"); // Capitalized for convention
const { verifySocketUser } = require('./middleware/authMiddleware');
const connectedUsers = new Map();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// MongoDB Connection and Server Start
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Socket.IO Events
io.use(verifySocketUser); // Token authentication middleware

// When a user connects to the socket
io.on('connection', (socket) => {
  const userId = socket.userId; // Retrieve user ID from token
  connectedUsers.set(userId, socket.id); // Store the user's socket ID
  console.log(`User connected: ${userId}`);

  // Handle sending a message
  socket.on('sendMessage', async ({ message, receiverId }) => {
    const msg = new Message({
      sender: userId,
      receiver: receiverId, // Ensure receiver is passed from the client
      message,
    });

    await msg.save(); // Save message to database

    const receiverSocketId = connectedUsers.get(receiverId); // Retrieve receiver's socket ID

    // If the receiver is connected, send the message
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receiveMessage', msg); // Send to receiver
    }

    // Send the message to the sender immediately (optional)
    socket.emit('receiveMessage', msg); // Send to sender

  });

  // Handle disconnection
  socket.on('disconnect', () => {
    connectedUsers.delete(userId); // Remove user from connected list
    console.log(`User disconnected: ${userId}`);
  });
});
