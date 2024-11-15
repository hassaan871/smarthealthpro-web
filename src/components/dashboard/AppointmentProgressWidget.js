import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import Context from "../context/context";

const AppointmentProgressWidget = () => {
  const { appointments, setAppointments } = useContext(Context);
  const [activeTab, setActiveTab] = useState("today");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const userString = localStorage.getItem("userToken");
        if (!userString) throw new Error("User data not found");
        const doctorId = userString;
        if (!doctorId) throw new Error("Doctor ID not found");
        const response = await fetch(
          `http://localhost:5000/appointment/getAppointmentsByDoctorId/${doctorId}`
        );
        if (!response.ok) throw new Error("Failed to fetch appointments");
        const data = await response.json();
        const pendingAppointments = data.filter(
          (apt) => apt.appointmentStatus === "pending"
        );
        setAppointments(pendingAppointments);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchAppointments();
  }, []);

  const handleChat = async (appointment) => {
    try {
      const userId = localStorage.getItem("userToken");
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const conversationsResponse = await axios.get(
        `http://localhost:5000/conversations/${userId}`
      );

      const conversations = conversationsResponse.data;
      const existingConversation = conversations.find(
        (conv) =>
          conv.participants.includes(userId) &&
          conv.participants.includes(appointment.patient.id)
      );

      const navigationState = {
        conversation: existingConversation
          ? {
              ...existingConversation,
              _id: existingConversation._id,
            }
          : null,
        patient: !existingConversation ? appointment.patient : null,
        doctorInfo: {
          id: userId,
          avatar: appointment?.doctor?.avatar,
          name: appointment?.doctor?.name,
        },
      };

      navigate("/dashboard/chat", {
        state: navigationState,
        replace: true,
      });
    } catch (error) {
      console.error("Error handling chat:", error);
      alert("Failed to open chat. Please try again.");
    }
  };

  const handleViewDetails = (appointment) => {
    navigate("/dashboard/doctorchatwithpatientdetail", {
      state: { appointment },
      replace: true,
    });
  };

  const getPriorityInfo = (priority) =>
    ({
      low: { percentage: 20, color: "bg-info", textColor: "text-info" },
      medium: {
        percentage: 40,
        color: "bg-success",
        textColor: "text-success",
      },
      moderate: {
        percentage: 60,
        color: "bg-warning",
        textColor: "text-warning",
      },
      high: { percentage: 80, color: "bg-danger", textColor: "text-danger" },
      "very high": {
        percentage: 100,
        color: "bg-danger",
        textColor: "text-danger",
      },
    }[priority.toLowerCase()] || {
      percentage: 0,
      color: "bg-secondary",
      textColor: "text-secondary",
    });

  const getStatusBadgeColor = (status) =>
    ({
      completed: "bg-success",
      pending: "bg-warning",
      canceled: "bg-danger",
    }[status.toLowerCase()] || "bg-secondary");

  const handleViewClick = (appointment) => {
    navigate("/doctorchatwithpatientdetail", { state: { appointment } });
  };

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
    <div className="container-fluid bg-gray-900 p-5">
      <div className="card bg-gray-800 border-0 shadow-lg">
        <div className="card-header bg-gray-800 border-bottom border-gray-700">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="card-title text-white mb-0">
              Comprehensive Appointment Progress
            </h3>
            <div className="btn-group" role="group">
              {["today", "week", "month"].map((tab) => (
                <button
                  key={tab}
                  className={`btn ${
                    activeTab === tab
                      ? "btn-primary"
                      : "btn-gray-600 text-gray-300"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="card-body">
          {appointments.length === 0 ? (
            <div className="text-center py-5 text-gray-400">
              <h5>No Pending Appointments</h5>
              <p>There are no appointments scheduled for this time period</p>
            </div>
          ) : (
            appointments.map((apt, index) => (
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
                            apt.patient.avatar?.url ||
                            apt.patient.avatar ||
                            "https://example.com/avatar.png"
                          }
                          alt="Patient"
                          className="rounded-circle"
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                          }}
                        />
                        <span
                          className={`position-absolute bottom-0 end-0 p-1 rounded-circle ${getStatusBadgeColor(
                            apt.appointmentStatus
                          )}`}
                          style={{ width: "12px", height: "12px" }}
                        ></span>
                      </div>
                    </div>

                    <div className="col-md-10">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h5 className="card-title text-white mb-1">
                            {apt.patient.name}
                          </h5>
                          <p className="card-text text-gray-400 mb-0">
                            {apt.description}
                          </p>
                        </div>
                        <span
                          className={`badge ${getStatusBadgeColor(
                            apt.appointmentStatus
                          )}`}
                        >
                          {apt.appointmentStatus}
                        </span>
                      </div>

                      <div className="row mb-3">
                        <div className="col-md-4">
                          <div className="d-flex align-items-center text-gray-400">
                            <Calendar size={16} className="me-2" />
                            {apt.date || "Not scheduled"}
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="d-flex align-items-center text-gray-400">
                            <Clock size={16} className="me-2" />
                            {apt.time || "Not scheduled"}
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="d-flex align-items-center text-gray-400">
                            <MapPin size={16} className="me-2" />
                            {apt.location || "Location TBD"}
                          </div>
                        </div>
                      </div>

                      <div className="progress mb-3" style={{ height: "6px" }}>
                        <div
                          className={`progress-bar ${
                            getPriorityInfo(apt.priority).color
                          }`}
                          role="progressbar"
                          style={{
                            width: `${
                              getPriorityInfo(apt.priority).percentage
                            }%`,
                          }}
                          aria-valuenow={
                            getPriorityInfo(apt.priority).percentage
                          }
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>

                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-3">
                          <span
                            className={`badge ${
                              getPriorityInfo(apt.priority).color
                            }`}
                          >
                            {apt.priority} Priority
                          </span>
                          <small className="text-gray-400">
                            Booked:{" "}
                            {new Date(apt.bookedOn).toLocaleDateString()}
                          </small>
                        </div>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-gray-600 d-flex align-items-center gap-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleChat(apt);
                            }}
                          >
                            <MessageSquare size={16} />
                            Chat
                          </button>
                          <button
                            className="btn btn-primary d-flex align-items-center gap-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(apt);
                            }}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
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

        /* Button Styles */
        .btn-gray-600 {
          background-color: #4b5563;
          border: none;
          color: #d1d5db;
        }

        .btn-gray-600:hover {
          background-color: #6b7280;
          color: #f3f4f6;
        }

        /* Form Control Styles */
        .form-control,
        .form-select,
        .input-group-text {
          background-color: #374151;
          border: none;
          color: #fff;
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

        /* Card Animation */
        .card {
          transition: transform 0.2s ease-in-out;
        }

        .card:hover {
          transform: translateY(-2px);
        }

        /* Alert Styles */
        .alert-success {
          background-color: #065f46;
          color: #fff;
          border: none;
        }

        .alert-danger {
          background-color: #7f1d1d;
          color: #fff;
          border: none;
        }

        /* Progress Bar */
        .progress {
          background-color: #4b5563;
        }

        /* Badge Styling */
        .badge {
          padding: 0.5em 0.8em;
          font-weight: 500;
        }

        /* Invalid Feedback */
        .invalid-feedback {
          color: #ef4444;
        }
      `}</style>

      <style jsx global>{`
        body {
          background-color: #111827 !important;
          margin: 0;
          padding: 0;
        }

        #root {
          background-color: #111827;
          min-height: 100vh;
        }

        .container-fluid {
          background-color: #111827 !important;
        }

        .card,
        .card-header,
        .card-body {
          background-color: inherit;
        }

        .card,
        .btn,
        .form-control {
          border: none;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #1f2937;
        }

        ::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }

        /* Override select dropdown styles */
        select option {
          background-color: #374151;
          color: #fff;
        }
      `}</style>
    </div>
  );
};

export default AppointmentProgressWidget;
