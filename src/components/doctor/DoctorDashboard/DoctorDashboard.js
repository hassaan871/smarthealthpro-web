import React from 'react';
import './DoctorDashboard.css';

function DoctorDashboard() {
  // Sample data for illustration purposes
  const upcomingAppointments = [
    { id: 1, client: 'John Doe', date: '2024-08-21', time: '10:00 AM' },
    { id: 2, client: 'Jane Smith', date: '2024-08-22', time: '11:00 AM' },
  ];

  const clients = [
    { id: 1, name: 'John Doe', contact: '123-456-7890' },
    { id: 2, name: 'Jane Smith', contact: '987-654-3210' },
  ];

  const appointmentRequests = [
    { id: 1, client: 'Alice Brown', date: '2024-08-23', time: '02:00 PM' },
    { id: 2, client: 'Bob White', date: '2024-08-24', time: '03:00 PM' },
  ];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Doctor Dashboard</h1>

      <section className="section">
        <h2 className="section-title">Upcoming Appointments</h2>
        <ul className="appointment-list">
          {upcomingAppointments.map((appointment) => (
            <li key={appointment.id} className="appointment-item">
              <span className="appointment-client">{appointment.client}</span>
              <span className="appointment-date">{appointment.date}</span>
              <span className="appointment-time">{appointment.time}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="section">
        <h2 className="section-title">Clients</h2>
        <ul className="client-list">
          {clients.map((client) => (
            <li key={client.id} className="client-item">
              <span className="client-name">{client.name}</span>
              <span className="client-contact">{client.contact}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="section">
        <h2 className="section-title">Appointment Requests</h2>
        <ul className="request-list">
          {appointmentRequests.map((request) => (
            <li key={request.id} className="request-item">
              <span className="request-client">{request.client}</span>
              <span className="request-date">{request.date}</span>
              <span className="request-time">{request.time}</span>
              <button className="accept-button">Accept</button>
              <button className="decline-button">Decline</button>
            </li>
          ))}
        </ul>
      </section>

      {/* Additional sections can be added as needed */}
    </div>
  );
}

export default DoctorDashboard;
