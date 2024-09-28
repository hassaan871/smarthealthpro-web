import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import 'bootstrap/dist/css/bootstrap.min.css';

const AppointmentProgressWidget = ({ style }) => {
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('today');
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

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

        const response = await fetch(`http://localhost:5000/appointment/getAppointmentsByDoctorId/${doctorId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }

        const data = await response.json();
        const pendingAppointments = data.filter((apt) => apt.appointmentStatus === 'pending');
        setAppointments(pendingAppointments);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAppointments();
  }, []);

  const getPriorityInfo = (priority) => {
    switch (priority.toLowerCase()) {
      case 'low':
        return { percentage: 20, color: 'bg-info' };
      case 'medium':
        return { percentage: 40, color: 'bg-success' };
      case 'moderate':
        return { percentage: 60, color: 'bg-warning' };
      case 'high':
        return { percentage: 80, color: 'bg-danger' };
      case 'very high':
        return { percentage: 100, color: 'bg-danger' };
      default:
        return { percentage: 0, color: 'bg-secondary' };
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-success';
      case 'pending':
        return 'bg-warning';
      default:
        return 'bg-secondary';
    }
  };

  const handleViewClick = (appointment) => {
    console.log('Viewing appointment:', appointment);
    navigate('/doctorchatwithpatientdetail', { state: { appointment } }); // Redirect with state
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (appointments.length === 0) {
    return <div className="no-appointments">No Pending Appointments</div>;
  }

  return (
    <div className="container" style={{ ...style, width: '80vw', margin: '100px auto 0 auto' }}>
      <div className="card shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h3 className="card-title">Comprehensive Appointment Progress</h3>
          <div className="btn-group" role="group">
            {['today', 'week', 'month'].map((tab) => (
              <button
                key={tab}
                className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="card-body">
          {appointments.map((appointment, index) => {
            const priorityInfo = getPriorityInfo(appointment.priority);
            return (
              <div key={index} className="card mb-4">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-2 d-flex align-items-center justify-content-center">
                      <img
                        src={appointment.avatar || 'https://bootdey.com/img/Content/avatar/avatar1.png'} // default avatar if not present
                        alt={appointment.patient.name}
                        className="rounded-circle"
                        style={{ width: '80px', height: '80px' }}
                      />
                    </div>
                    <div className="col-md-10">
                      <h5 className="card-title">{appointment.patient.name}</h5>
                      <p className="card-text">{appointment.description}</p>
                      <div className="row mb-3">
                        <div className="col-md-4">
                          <strong>Date:</strong> {appointment.date}
                        </div>
                        <div className="col-md-4">
                          <strong>Time:</strong> {appointment.time}
                        </div>
                        <div className="col-md-4">
                          <strong>Location:</strong> {appointment.location}
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-4">
                          <strong>Status:</strong>{' '}
                          <span className={`badge ${getStatusBadgeColor(appointment.appointmentStatus)}`}>
                            {appointment.appointmentStatus}
                          </span>
                        </div>
                        <div className="col-md-4">
                          <strong>Priority:</strong>{' '}
                          <span className={`badge ${priorityInfo.color}`}>{appointment.priority}</span>
                        </div>
                        <div className="col-md-4">
                          <strong>Booked On:</strong> {appointment.bookedOn}
                        </div>
                      </div>
                      <div className="progress mb-3" style={{ height: '20px' }}>
                        <div
                          className={`progress-bar ${priorityInfo.color}`}
                          role="progressbar"
                          style={{ width: `${priorityInfo.percentage}%` }}
                          aria-valuenow={priorityInfo.percentage}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          {appointment.priority} Priority
                        </div>
                      </div>
                      <div className="d-flex justify-content-end">
                        <button className="btn btn-primary" onClick={() => handleViewClick(appointment)}>
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AppointmentProgressWidget;
