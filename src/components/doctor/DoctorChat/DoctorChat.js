import React, { useState } from 'react';
import './DoctorChat.css';

function DoctorChat() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'patient', text: 'Hello, Doctor. I have been experiencing some headaches recently.' },
    { id: 2, sender: 'doctor', text: 'Hello! How long have you been having these headaches?' },
  ]);

  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const newMsg = {
      id: messages.length + 1,
      sender: 'doctor', // Assuming the doctor is the one sending the message
      text: newMessage,
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  return (
    <div className="chat-container">
      <h1 className="chat-title">Chat with Patient</h1>

      <div className="message-list">
        {messages.map((message) => (
          <div key={message.id} className={`message-item ${message.sender}`}>
            <div className="message-bubble">{message.text}</div>
          </div>
        ))}
      </div>

      <div className="message-input-container">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="message-input"
        />
        <button onClick={handleSendMessage} className="send-button">Send</button>
      </div>
    </div>
  );
}

export default DoctorChat;
