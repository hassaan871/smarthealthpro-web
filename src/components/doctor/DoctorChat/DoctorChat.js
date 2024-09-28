import React, { useState, useRef, useEffect } from 'react';
import './DoctorChat.css';

function DoctorChat() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'patient', text: 'Hello, Doctor. I have been experiencing some headaches recently.' },
    { id: 2, sender: 'doctor', text: 'Hello! How long have you been having these headaches?' },
  ]);

  const [newMessage, setNewMessage] = useState('');
  const messageListRef = useRef(null);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const newMsg = {
      id: messages.length + 1,
      sender: 'doctor',
      text: newMessage,
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  return (
    <div className="chat-container d-flex flex-column h-100">
      <div className="message-list flex-grow-1 overflow-auto" ref={messageListRef}>
        {messages.map((message) => (
          <div key={message.id} className={`message-item ${message.sender}`}>
            <div className="message-bubble">{message.text}</div>
          </div>
        ))}
      </div>

      <div className="message-input-container mt-3">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="message-input form-control"
        />
        <button onClick={handleSendMessage} className="send-button btn btn-primary ml-2">Send</button>
      </div>
    </div>
  );
}

export default DoctorChat;