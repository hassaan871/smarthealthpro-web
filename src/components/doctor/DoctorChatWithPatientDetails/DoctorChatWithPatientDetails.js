import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './DoctorChatWithPatientDetails.css';
import DoctorChat from '../DoctorChat/DoctorChat';

function DoctorChatWithPatientDetails() {
  const location = useLocation();
  const { appointment } = location.state || {};

  const [messages, setMessages] = useState([
    { id: 1, sender: 'patient', text: 'Hello, Doctor. I have been experiencing some headaches recently.' },
    { id: 2, sender: 'doctor', text: 'Hello! How long have you been having these headaches?' },
  ]);

  const [newMessage, setNewMessage] = useState('');

  // const patientInfo = {
  //   fullName: 'John Michael Doe',
  //   age: 45,
  //   gender: 'Male',
  //   email: 'johndoe@example.com',
  //   medicalHistory: [
  //     'Diabetes - Diagnosed in 2015',
  //     'Hypertension - Diagnosed in 2017',
  //     'Allergic to Penicillin',
  //   ],
  //   imageUrl: '/api/placeholder/100/100', // Placeholder image, replace with actual image URL
  // };

  const patientInfo = appointment ? {
    fullName: appointment.patient.name,
    age: appointment.patient.age || 'N/A',
    gender: appointment.patient.gender || 'N/A',
    email: appointment.patient.email || 'N/A',
    medicalHistory: appointment.patient.medicalHistory || [],
    imageUrl: appointment.avatar || '/api/placeholder/100/100',
  } : {
    fullName: 'Patient Name Not Available',
    age: 'N/A',
    gender: 'N/A',
    email: 'N/A',
    medicalHistory: [],
    imageUrl: '/api/placeholder/100/100',
  };


  const chatSummaries = [
    { date: '2024-09-01', summary: 'Discussed recurring headaches and sleep patterns.' },
    { date: '2024-08-15', summary: 'Reviewed medication for hypertension, adjusted dosage.' },
    { date: '2024-07-30', summary: 'Annual check-up, all vitals normal. Recommended more exercise.' },
    // Add more summaries as needed
  ];

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
    // <div className="DCWPD-chat-with-details-container">
    //   <div className="DCWPD-patient-details-container">
    //     <h2 className="DCWPD-patient-details-title">Patient Details</h2>
    //     <div className="DCWPD-patient-info">
    //       <img src={patientInfo.imageUrl} alt={patientInfo.fullName} className="DCWPD-patient-image" />
    //       <p><strong>Name:</strong> {patientInfo.fullName}</p>
    //       <p><strong>Age:</strong> {patientInfo.age}</p>
    //       <p><strong>Gender:</strong> {patientInfo.gender}</p>
    //       <p><strong>Email:</strong> {patientInfo.email}</p>
    //     </div>
    //     <h3 className="DCWPD-medical-history-title">Medical History</h3>
    //     <ul className="DCWPD-medical-history-list">
    //       {patientInfo.medicalHistory.map((item, index) => (
    //         <li key={index} className="DCWPD-medical-history-item">
    //           {item}
    //         </li>
    //       ))}
    //     </ul>
    //     <h3 className="DCWPD-chat-summaries-title">Chat Summaries</h3>
    //     <div className="DCWPD-chat-summaries-list">
    //       {chatSummaries.map((summary, index) => (
    //         <div key={index} className="DCWPD-chat-summary-item">
    //           <div className="DCWPD-chat-summary-date">{summary.date}</div>
    //           <div>{summary.summary}</div>
    //         </div>
    //       ))}
    //     </div>
    //   </div>
    <div className="DCWPD-chat-with-details-container">
    <div className="DCWPD-patient-details-container">
      <h2 className="DCWPD-patient-details-title">Patient Details</h2>
      <div className="DCWPD-patient-info">
        <img src={patientInfo.imageUrl} alt={patientInfo.fullName} className="DCWPD-patient-image" />
        <p><strong>Name:</strong> {patientInfo.fullName}</p>
        <p><strong>Age:</strong> {patientInfo.age}</p>
        <p><strong>Gender:</strong> {patientInfo.gender}</p>
        <p><strong>Email:</strong> {patientInfo.email}</p>
        {appointment && (
          <>
            <p><strong>Appointment Date:</strong> {appointment.date}</p>
            <p><strong>Appointment Time:</strong> {appointment.time}</p>
            <p><strong>Location:</strong> {appointment.location}</p>
            <p><strong>Status:</strong> {appointment.appointmentStatus}</p>
            <p><strong>Priority:</strong> {appointment.priority}</p>
          </>
        )}
      </div>
      <h3 className="DCWPD-medical-history-title">Previous Prescriptions and Notes</h3>
      <ul className="DCWPD-medical-history-list">
        {patientInfo.medicalHistory.map((item, index) => (
          <li key={index} className="DCWPD-medical-history-item">
            {item}
          </li>
        ))}
      </ul>
      <h3 className="DCWPD-chat-summaries-title">Chat Summaries</h3>
      <div className="DCWPD-chat-summaries-list">
        {chatSummaries.map((summary, index) => (
          <div key={index} className="DCWPD-chat-summary-item">
            <div className="DCWPD-chat-summary-date">{summary.date}</div>
            <div>{summary.summary}</div>
          </div>
        ))}
      </div>
    </div>
    <DoctorChat/>
    </div>
  );
}

export default DoctorChatWithPatientDetails;
