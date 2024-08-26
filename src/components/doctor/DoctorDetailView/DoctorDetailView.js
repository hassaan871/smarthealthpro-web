// File: DoctorDashboard.jsx

import React from 'react';
import './DoctorDetailView.css';

const DoctorDetailView = () => {
  const doctor = {
    id: "66c0b2aa90040b7bc334b842",
    name: "Dr. Alice Smith",
    avatar: "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-prof...",
    specialization: "Cardiologist",
    patient: "66c0b2aa90040b7bc334b845",
    date: "2024-08-20T09:00:00.000Z",
    availableTimeSlots: ["09:00 AM", "10:00 AM", "11:00 AM"],
    selectedTimeSlot: "09:00 AM",
    appointmentStatus: "pending",
    description: "Routine check-up.",
    location: "Wilshire Medical Center, Lahore"
  };

  const handleEditClick = () => {
    console.log('Edit button clicked for:', doctor.name);
  };

  return (
    <div className="doctor-dashboard">
      <div className="doctor-info">
        <img src={doctor.avatar} alt={doctor.name} className="doctor-avatar" />
        <h2 className="doctor-name">{doctor.name}</h2>
        <p className="doctor-specialization">{doctor.specialization}</p>
      </div>

      <div className="appointment-details">
        <p><strong>Location:</strong> {doctor.location}</p>
        <p><strong>Description:</strong> {doctor.description}</p>
        <p><strong>Appointment Status:</strong> {doctor.appointmentStatus}</p>
        <p><strong>Date:</strong> {new Date(doctor.date).toLocaleDateString()}</p>
        <p><strong>Selected Time Slot:</strong> {doctor.selectedTimeSlot}</p>
      </div>

      <div className="time-slots">
        <h3>Available Time Slots</h3>
        <ul>
          {doctor.availableTimeSlots.map((slot, index) => (
            <li key={index} className={slot === doctor.selectedTimeSlot ? 'selected-slot' : ''}>
              {slot}
            </li>
          ))}
        </ul>
      </div>

      <button className="edit-button" onClick={handleEditClick}>
        Edit
      </button>
    </div>
  );
};

export default DoctorDetailView;
