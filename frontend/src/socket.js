import { io } from 'socket.io-client';

export const socket = io('http://localhost:5000', {
  auth: {
    token: localStorage.getItem('token'), // Send the token in the initial connection
  },
  autoConnect: true,  // Ensures the socket connects automatically
});
