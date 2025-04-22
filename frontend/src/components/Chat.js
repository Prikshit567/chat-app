import React, { useEffect, useState } from 'react';
import { socket } from '../socket';
import axios from 'axios';
import './chat.css';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  console.log(token,"tokedddddn")
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    navigate('/');
  };

  useEffect(() => {
    // Fetch all other users
    axios.get('http://localhost:5000/api/auth/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(res => setUsers(res.data));
  }, []);

  useEffect(() => {
    // Socket connection setup with token for authorization
    socket.auth = { token };
    socket.connect();

    socket.on('receiveMessage', (data) => {
      // Only display the message if it's for the selected user
      if (data.sender === selectedUser?._id) {
        setChatLog(prev => [...prev, data]);
      }
    });

    return () => {
      socket.disconnect();  // Clean up when component unmounts
      socket.off('receiveMessage');  // Remove event listener when unmounting
    };
  }, [selectedUser, token]);  // Dependencies updated to reconnect on token/user changes

  const sendMessage = () => {
    if (message.trim() && selectedUser) {
      socket.emit('sendMessage', { message, receiverId: selectedUser._id });  // Match the receiver as 'receiverId'
      setChatLog(prev => [...prev, { sender: user._id, message }]); // Update sender chat log
      setMessage('');
    }
  };

  return (
    <div className="chat-container">
      <div className="header">
        <h3>Welcome, {user.username}</h3>
      </div>

      <div className="chat-selection">
        <label>Select a user to chat with:</label>
        <select
          className="select-user"
          onChange={e => {
            const selected = users.find(u => u._id === e.target.value);
            setSelectedUser(selected);
            setChatLog([]); // Reset chat for new user
          }}
        >
          <option value="">-- Select User --</option>
          {users.map(u => (
            <option key={u._id} value={u._id}>{u.username}</option>
          ))}
        </select>

      </div>
      <button onClick={handleLogout} className="logout-button">Logout</button>


      {selectedUser && (
        <div className="chat-window">
          <h4>Chatting with: {selectedUser.username}</h4>
          <div className="chat-log">
            {chatLog.map((msg, i) => (
              <div
                key={i}
                className={msg.sender === user._id ? 'sender' : 'receiver'}
              >
                <strong>{msg.sender === user._id ? 'You' : selectedUser.username}:</strong> {msg.message}
              </div>
            ))}
          </div>

          <div className="chat-input-container">
            <input
              className="chat-input"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button className="send-button" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


export default Chat;
