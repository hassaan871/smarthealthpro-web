import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  Flag,
  Calendar as CalendarIcon,
  Search,
  Filter,
  MessageSquare,
} from "lucide-react";

const Patients = ({ style }) => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const userString = localStorage.getItem("userToken");
        if (!userString) {
          throw new Error("User data not found in local storage");
        }

        const doctorId = userString;

        if (!doctorId) {
          throw new Error("Doctor ID not found in user data");
        }

        const response = await fetch(
          `http://localhost:5000/appointment/getAppointmentsByDoctorId/${doctorId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch appointments");
        }

        const data = await response.json();
        setAppointments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const getPriorityInfo = (priority) => {
    switch (priority.toLowerCase()) {
      case "low":
        return { percentage: 20, color: "bg-info", textColor: "text-info" };
      case "medium":
        return {
          percentage: 40,
          color: "bg-success",
          textColor: "text-success",
        };
      case "moderate":
        return {
          percentage: 60,
          color: "bg-warning",
          textColor: "text-warning",
        };
      case "high":
        return { percentage: 80, color: "bg-danger", textColor: "text-danger" };
      case "very high":
        return {
          percentage: 100,
          color: "bg-danger",
          textColor: "text-danger",
        };
      default:
        return {
          percentage: 0,
          color: "bg-secondary",
          textColor: "text-secondary",
        };
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-success";
      case "pending":
        return "bg-warning";
      case "canceled":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  const handleViewClick = (appointment) => {
    navigate("/doctorchatwithpatientdetail", { state: { appointment } });
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.patient.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      appointment.appointmentStatus.toLowerCase() ===
        statusFilter.toLowerCase();

    const matchesPriority =
      priorityFilter === "all" ||
      appointment.priority.toLowerCase() === priorityFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger d-flex align-items-center">
          <AlertCircle className="me-2" />
          {error}
        </div>
      </div>
    );
  }

  return (
    <div
      className="container-fluid bg-gray-900"
      style={{ ...style, width: "90vw", margin: "80px auto 0 auto" }}
    >
      {/* Filters Section */}
      <div className="card bg-gray-800 border-0 shadow-lg mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-gray-700 border-0">
                  <Search size={18} className="text-gray-400" />
                </span>
                <input
                  type="text"
                  className="form-control bg-gray-700 border-0 text-white"
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select bg-gray-700 border-0 text-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-select bg-gray-700 border-0 text-white"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="very high">Very High</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="card bg-gray-800 border-0 shadow-lg">
        <div className="card-header bg-gray-800 border-bottom border-gray-700">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="card-title text-white mb-0">
              Patients ({filteredAppointments.length})
            </h3>
            <div className="d-flex gap-2">
              <button className="btn btn-gray-700 d-flex align-items-center gap-2">
                <Filter size={16} /> Filter
              </button>
              <button className="btn btn-primary d-flex align-items-center gap-2">
                <CalendarIcon size={16} /> New Appointment
              </button>
            </div>
          </div>
        </div>

        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-5 text-gray-400">
              <img
                src="/api/placeholder/200/200"
                alt="No appointments"
                className="mb-3"
              />
              <h5>No Appointments Found</h5>
              <p>Try adjusting your filters or search terms</p>
            </div>
          ) : (
            filteredAppointments.map((appointment, index) => {
              const priorityInfo = getPriorityInfo(appointment.priority);
              return (
                <div
                  key={index}
                  className="card bg-gray-700 border-0 shadow-sm mb-4"
                >
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-2 d-flex align-items-center justify-content-center">
                        <div className="position-relative">
                          <img
                            src={
                              appointment.patient.avatar ||
                              "/api/placeholder/80/80"
                            }
                            alt={appointment.patient.name}
                            className="rounded-circle"
                            style={{
                              width: "80px",
                              height: "80px",
                              objectFit: "cover",
                            }}
                          />
                          <span
                            className={`position-absolute bottom-0 end-0 p-1 rounded-circle ${
                              appointment.appointmentStatus.toLowerCase() ===
                              "completed"
                                ? "bg-success"
                                : appointment.appointmentStatus.toLowerCase() ===
                                  "pending"
                                ? "bg-warning"
                                : "bg-danger"
                            }`}
                            style={{ width: "12px", height: "12px" }}
                          ></span>
                        </div>
                      </div>

                      <div className="col-md-10">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div>
                            <h5 className="card-title text-white mb-1">
                              {appointment.patient.name}
                            </h5>
                            <p className="card-text text-gray-400 mb-0">
                              {appointment.description}
                            </p>
                          </div>
                          <span
                            className={`badge ${getStatusBadgeColor(
                              appointment.appointmentStatus
                            )}`}
                          >
                            {appointment.appointmentStatus}
                          </span>
                        </div>

                        <div className="row mb-3">
                          <div className="col-md-4">
                            <div className="d-flex align-items-center text-gray-400">
                              <Calendar size={16} className="me-2" />
                              {appointment.date}
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="d-flex align-items-center text-gray-400">
                              <Clock size={16} className="me-2" />
                              {appointment.time}
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="d-flex align-items-center text-gray-400">
                              <MapPin size={16} className="me-2" />
                              {appointment.location}
                            </div>
                          </div>
                        </div>

                        <div
                          className="progress mb-3"
                          style={{ height: "6px" }}
                        >
                          <div
                            className={`progress-bar ${priorityInfo.color}`}
                            role="progressbar"
                            style={{ width: `${priorityInfo.percentage}%` }}
                            aria-valuenow={priorityInfo.percentage}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          />
                        </div>

                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center gap-3">
                            <span className={`badge ${priorityInfo.color}`}>
                              {appointment.priority} Priority
                            </span>
                            <small className="text-gray-400">
                              Booked:{" "}
                              {new Date(
                                appointment.bookedOn
                              ).toLocaleDateString()}
                            </small>
                          </div>

                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-gray-600 d-flex align-items-center gap-2"
                              onClick={() => handleViewClick(appointment)}
                            >
                              <MessageSquare size={16} />
                              Chat
                            </button>
                            <button
                              className="btn btn-primary d-flex align-items-center gap-2"
                              onClick={() => handleViewClick(appointment)}
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <style jsx>{`
        .bg-gray-900 {
          background-color: #111827;
        }
        .bg-gray-800 {
          background-color: #1f2937;
        }
        .bg-gray-700 {
          background-color: #374151;
        }
        .bg-gray-600 {
          background-color: #4b5563;
        }
        .text-gray-400 {
          color: #9ca3af;
        }
        .text-gray-300 {
          color: #d1d5db;
        }
        .border-gray-700 {
          border-color: #374151 !important;
        }

        .btn-gray-700 {
          background-color: #374151;
          border: none;
          color: #d1d5db;
        }

        .btn-gray-700:hover {
          background-color: #4b5563;
          color: #f3f4f6;
        }

        .btn-gray-600 {
          background-color: #4b5563;
          border: none;
          color: #d1d5db;
        }

        .btn-gray-600:hover {
          background-color: #6b7280;
          color: #f3f4f6;
        }

        .form-control:focus,
        .form-select:focus {
          background-color: #4b5563;
          border-color: #6b7280;
          color: #f3f4f6;
          box-shadow: none;
        }

        .form-control::placeholder {
          color: #9ca3af;
        }

        .card {
          transition: transform 0.2s ease-in-out;
        }

        .card:hover {
          transform: translateY(-2px);
        }

        .progress {
          background-color: #4b5563;
        }

        .badge {
          padding: 0.5em 0.8em;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default Patients;
