import React, { useState, useEffect } from 'react';
import { format, isToday, isThisWeek, isThisMonth, parseISO } from 'date-fns';
import './Appointments.css';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('today');

  useEffect(() => {
    const fetchAppointments = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      const doctorId = user.id;
      
      try {
        const response = await fetch(`http://localhost:5000/appointment/getAppointmentsByDoctorId/${doctorId}`);
        if (!response.ok) throw new Error('Failed to fetch appointments');
        const data = await response.json();
        setAppointments(data.filter(app => app.appointmentStatus === 'pending'));
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter(app => {
    const appointmentDate = parseISO(app.date);
    switch (filter) {
      case 'today':
        return isToday(appointmentDate);
      case 'week':
        return isThisWeek(appointmentDate);
      case 'month':
        return isThisMonth(appointmentDate);
      default:
        return true;
    }
  });

  const getPriorityBarWidth = (priority) => {
    switch (priority.toLowerCase()) {
      case 'low': return '20%';
      case 'mild': return '40%';
      case 'high': return '80%';
      case 'very high': return '100%';
      default: return '0%';
    }
  };

  return (
    <div className="appointments-container">
      <div className="filter-buttons">
        <button onClick={() => setFilter('today')} className={filter === 'today' ? 'active' : ''}>Today</button>
        <button onClick={() => setFilter('week')} className={filter === 'week' ? 'active' : ''}>Week</button>
        <button onClick={() => setFilter('month')} className={filter === 'month' ? 'active' : ''}>Month</button>
      </div>
      <div className="appointments-list">
        {filteredAppointments.map(app => (
          <div key={app._id} className="appointment-card">
            <img src={app.patient.avatar} alt={app.patient.name} className="patient-avatar" />
            <div className="appointment-details">
              <h3>{app.patient.name}</h3>
              <p>Date: {format(parseISO(app.date), 'MMM dd, yyyy')}</p>
              <p>Time: {app.time}</p>
              <p>Status: {app.appointmentStatus}</p>
              <p>Description: {app.description}</p>
              <p>Booked On: {format(parseISO(app.bookedOn), 'MMM dd, yyyy')}</p>
              <div className="priority-bar">
                <div className="priority-fill" style={{ width: getPriorityBarWidth(app.priority) }}></div>
              </div>
              <p>Priority: {app.priority}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Appointments;