import React from 'react';
import './PatientDetails.css';

function PatientDetails() {
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

  return (
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
  );
}

export default PatientDetails;
