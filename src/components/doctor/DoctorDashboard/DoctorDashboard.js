import React, { useState, useEffect } from 'react';
import { Home, File, Mail, Bell, MapPin, PieChart } from 'lucide-react';
import './DoctorDashboard.css';

const DoctorDashboard = ({ doctorId }) => {
  const [activeBlock, setActiveBlock] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');

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

  const handleBlockClick = (blockType) => {
    setActiveBlock(blockType);
  };

  return (
    <div className="DoctorDashboard-container">
      <div className="DoctorDashboard-sidebar">
        <div className="DoctorDashboard-profile">
          <img src="/api/placeholder/100/100" alt="Doctor" className="DoctorDashboard-profile-picture" />
          <h2>JOHN DON</h2>
          <p>johndon@company.com</p>
        </div>
        <nav>
          <a href="#" className="active"><Home size={20} /> Home</a>
          <a href="#"><File size={20} /> Appointments</a>
          <a href="#"><Mail size={20} /> Messages</a>
          <a href="#"><Bell size={20} /> Notifications</a>
          <a href="#"><MapPin size={20} /> Patients</a>
          <a href="#"><PieChart size={20} /> Graph</a>
        </nav>
      </div>
      <div className="DoctorDashboard-main-content">
        <header className="DoctorDashboard-header">
          <h1>Dashboard User</h1>
          <button className="DoctorDashboard-menu-toggle">☰</button>
        </header>

        <div className="DoctorDashboard-stats-row">
          <div
            className={`DoctorDashboard-stat-card ${activeBlock === 'earning' ? 'active' : ''}`}
            onClick={() => handleBlockClick('earning')}
          >
            <span>Appointments</span>
            <h3>Overview</h3>
            <span className="DoctorDashboard-icon">$</span>
          </div>
          <div
            className={`DoctorDashboard-stat-card ${activeBlock === 'share' ? 'active' : ''}`}
            onClick={() => handleBlockClick('share')}
          >
            <span>Patients</span>
            <h3>All Time</h3>
            <span className="DoctorDashboard-icon">
              <Mail size={20} />
            </span>
          </div>
          <div
            className={`DoctorDashboard-stat-card ${activeBlock === 'like' ? 'active' : ''}`}
            onClick={() => handleBlockClick('like')}
          >
            <span>Likes</span>
            <h3>1259</h3>
            <span className="DoctorDashboard-icon">👍</span>
          </div>
        </div>

        <div className="DoctorDashboard-appointments-list">
          <h2>Appointments</h2>
          {error ? (
            <p className="DoctorDashboard-error">{error}</p>
          ) : (
            <ul>
              {appointments.map(appointment => (
                <AppointmentItem key={appointment._id} appointment={appointment} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

const AppointmentItem = ({ appointment }) => {
  const [patientInfo, setPatientInfo] = useState(null);

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

  if (!patientInfo) {
    return <li className="DoctorDashboard-appointment-card">Loading patient info...</li>;
  }

  return (
    <li className="DoctorDashboard-appointment-card">
      <img src={patientInfo.avatar} alt={patientInfo.fullName} className="DoctorDashboard-appointment-avatar" />
      <div className="DoctorDashboard-appointment-info">
        <h3>{patientInfo.fullName}</h3>
        <p>Email: {patientInfo.email}</p>
        <p>Date: {new Date(appointment.date).toLocaleDateString()}</p>
        <p>Time: {appointment.selectedTimeSlot}</p>
        <p>Status: {appointment.appointmentStatus}</p>
        <p>Description: {appointment.description}</p>
        <p>Location: {appointment.location}</p>
      </div>
    </li>
  );
};

export default DoctorDashboard;