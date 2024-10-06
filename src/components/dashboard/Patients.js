import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Patients = ({ style }) => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
        setAppointments(data); // Display all appointments
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
      case 'canceled':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  const handleViewClick = (appointment) => {
    console.log('Viewing appointment:', appointment);
    navigate('/doctorchatwithpatientdetail', { state: { appointment } });
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (appointments.length === 0) {
    return <div className="no-appointments">No Appointments Available</div>;
  }

  return (
    <div className="container" style={{ ...style, width: '80vw', margin: '100px auto 0 auto' }}>
      <div className="card shadow-sm">
        <div className="card-header">
          <h3 className="card-title">Patients</h3>
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
                        src={appointment.patient.avatar || 'https://bootdey.com/img/Content/avatar/avatar1.png'}
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
                          <strong>Booked On:</strong> {new Date(appointment.bookedOn).toLocaleString()}
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

export default Patients;