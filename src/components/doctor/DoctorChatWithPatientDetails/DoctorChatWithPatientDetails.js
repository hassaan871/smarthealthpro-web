import React, { useState } from 'react';
import './DoctorChatWithPatientDetails.css';

function DoctorChatWithPatientDetails() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'patient', text: 'Hello, Doctor. I have been experiencing some headaches recently.' },
    { id: 2, sender: 'doctor', text: 'Hello! How long have you been having these headaches?' },
  ]);

  const [newMessage, setNewMessage] = useState('');

  const patientInfo = {
    name: 'John Doe',
    age: 45,
    gender: 'Male',
    contact: '123-456-7890',
    medicalHistory: [
      'Diabetes - Diagnosed in 2015',
      'Hypertension - Diagnosed in 2017',
      'Allergic to Penicillin',
    ],
  };

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
    <div className="chat-with-details-container">
      <div className="patient-details-container">
        <h2 className="patient-details-title">Patient Details</h2>
        <div className="patient-info">
          <p><strong>Name:</strong> {patientInfo.name}</p>
          <p><strong>Age:</strong> {patientInfo.age}</p>
          <p><strong>Gender:</strong> {patientInfo.gender}</p>
          <p><strong>Contact:</strong> {patientInfo.contact}</p>
        </div>
        <h3 className="medical-history-title">Medical History</h3>
        <ul className="medical-history-list">
          {patientInfo.medicalHistory.map((item, index) => (
            <li key={index} className="medical-history-item">
              {item}
            </li>
          ))}
        </ul>
      </div>

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
    </div>
  );
}

export default DoctorChatWithPatientDetails;
