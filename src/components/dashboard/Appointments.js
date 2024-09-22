import  { useState, useEffect } from 'react';
import React from 'react';
import './Appointments.css';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const userString = localStorage.getItem('user');
        if (!userString) {
          throw new Error('User data not found in local storage');
        }

        const user = JSON.parse(userString);
        const doctorId = user.id;

        if (!doctorId) {
          throw new Error('Doctor ID not found in user data');
        }

        console.log('Doctor ID:', doctorId);

        const response = await fetch(`http://localhost:5000/appointment/getAppointmentsByDoctorId/${doctorId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }

        const data = await response.json();
        const pendingAppointments = data.filter(apt => apt.appointmentStatus === 'pending');
        setAppointments(pendingAppointments);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAppointments();
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (appointments.length === 0) {
    return <div className="no-appointments">No Pending Appointments</div>;
  }

  return (
    <div className="appointments-container">
      {appointments.map((appointment) => (
        <div key={appointment._id} className="appointment-card">
          <img src={appointment.patient.avatar} alt={appointment.patient.name} className="patient-avatar" />
          <div className="appointment-details">
            <h3>{appointment.patient.name}</h3>
            <p><strong>Date:</strong> {appointment.date}</p>
            <p><strong>Time:</strong> {appointment.time}</p>
            <p><strong>Status:</strong> {appointment.appointmentStatus}</p>
            <p><strong>Description:</strong> {appointment.description}</p>
            <p><strong>Location:</strong> {appointment.location}</p>
            <p><strong>Priority:</strong> {appointment.priority}</p>
            <p><strong>Booked On:</strong> {new Date(appointment.bookedOn).toLocaleString()}</p>
            <div className={`appointment-progress ${getPriorityClass(appointment.priority)}`}>
              <div className="progress-bar"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const getPriorityClass = (priority) => {
  switch (priority) {
    case 'low':
      return 'priority-low';
    case 'mild':
      return 'priority-mild';
    case 'moderate':
      return 'priority-moderate';
    case 'high':
      return 'priority-high';
    case 'very high':
      return 'priority-very-high';
    default:
      return '';
  }
};

export default Appointments;