import React, { useEffect, useState } from 'react';
import './AllPatients.css';

function AllPatients({ doctorId }) {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');

  // Fetch appointments by doctor ID
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`http://localhost:5000/appointment/getAppointmentsByDoctorId/${doctorId}`);
        const data = await response.json();
        setAppointments(data);
      } catch (err) {
        setError('Failed to fetch appointments');
      }
    };

    fetchAppointments();
  }, [doctorId]);

  return (
    <div className="AllPatientsComponent-wrapper">
      <h1 className="AllPatientsComponent-title">Appointments</h1>
      {error ? (
        <p className="AllPatientsComponent-error">{error}</p>
      ) : (
        <ul className="AllPatientsComponent-list">
          {appointments.map((appointment) => (
            <AppointmentItem key={appointment._id} appointment={appointment} />
          ))}
        </ul>
      )}
    </div>
  );
}

function AppointmentItem({ appointment }) {
  const [patientInfo, setPatientInfo] = useState(null);

  // Fetch patient info by patient ID
  useEffect(() => {
    const fetchPatientInfo = async () => {
      try {
        const response = await fetch(`http://localhost:5000/user/getUserInfo/${appointment.patient}`);
        const data = await response.json();
        setPatientInfo(data.user);
      } catch (err) {
        console.error('Failed to fetch patient info', err);
      }
    };

    fetchPatientInfo();
  }, [appointment.patient]);

  return (
    <li className="AllPatientsComponent-item">
      {patientInfo ? (
        <div className="AllPatientsComponent-card">
          <img
            src={patientInfo.avatar}
            alt={patientInfo.fullName}
            className="AllPatientsComponent-avatar"
          />
          <div className="AllPatientsComponent-info">
            <h3 className="AllPatientsComponent-name">{patientInfo.fullName}</h3>
            <p className="AllPatientsComponent-email">{patientInfo.email}</p>
            <div className="AllPatientsComponent-appointmentDetails">
              <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
              <p><strong>Time Slot:</strong> {appointment.selectedTimeSlot}</p>
              <p><strong>Status:</strong> {appointment.appointmentStatus}</p>
              <p><strong>Description:</strong> {appointment.description}</p>
              <p><strong>Location:</strong> {appointment.location}</p>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading patient info...</p>
      )}
    </li>
  );
}

export default AllPatients;
