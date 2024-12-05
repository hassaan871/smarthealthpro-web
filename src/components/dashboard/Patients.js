import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  Calendar as CalendarIcon,
  Search,
  Filter,
  MessageSquare,
  FileText, // Add this
  PlusCircle, // Add this
  ClipboardList,
  CheckCircle, // Add this
} from "lucide-react";
import axios from "axios";
import SummaryModal from "../notes/SummaryModal";
import NotesModal from "../notes/NotesModal";
import { getPriorityConfig, getStatusConfig } from "../../colorsConfig";

const Patients = () => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [note, setNote] = useState("");
  const [updatingPriority, setUpdatingPriority] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top
  }, []);

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

  const getStatusBadgeColor = (status) => {
    const config = getStatusConfig(status);
    return config.badgeClass.replace("badge-", "bg-");
  };

  const handleViewClick = async (appointment) => {
    try {
      const userId = localStorage.getItem("userToken");
      if (!userId) {
        throw new Error("User not authenticated");
      }

      // Get all conversations for the current user
      const conversationsResponse = await axios.get(
        `http://localhost:5000/conversations/${userId}`
      );

      const conversations = conversationsResponse.data;
      console.log("All conversations:", conversations);
      console.log("Current userId:", userId);
      console.log("Patient ID to match:", appointment.patient.id);

      // Modified conversation finding logic
      const existingConversation = conversations.find((conv) => {
        // The participants array contains the direct IDs, so this comparison should work
        return (
          conv.participants.includes(userId) &&
          conv.participants.includes(appointment.patient.id)
        );
      });

      console.log("Found existing conversation:", existingConversation);

      const navigationState = {
        conversation: existingConversation
          ? {
              ...existingConversation,
              _id: existingConversation._id, // Convert _id to string format if needed
            }
          : null,
        patient: !existingConversation ? appointment.patient : null,
        doctorInfo: {
          id: userId,
          avatar: appointment?.doctor?.avatar,
          name: appointment?.doctor?.name,
        },
      };

      console.log("Navigation state being passed:", navigationState);

      navigate("/dashboard/chat", {
        state: navigationState,
        replace: true,
      });
    } catch (error) {
      console.error("Error handling chat:", error);
      alert("Failed to open chat. Please try again.");
    }
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
      <div className="container-fluid bg-gray-900 min-vh-100 d-flex align-items-center justify-content-center">
        <div className="alert alert-danger d-flex align-items-center">
          <AlertCircle className="me-2" />
          {error}
        </div>
      </div>
    );
  }

  const handlePriorityChange = async (appointmentId, newPriority, e) => {
    e.stopPropagation();
    setUpdatingPriority(appointmentId);
    try {
      const response = await fetch(
        `http://localhost:5000/appointment/updateAppointment/${appointmentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ priority: newPriority }),
        }
      );

      if (!response.ok) throw new Error("Failed to update priority");

      setAppointments((prevAppointments) =>
        prevAppointments.map((apt) =>
          apt._id === appointmentId ? { ...apt, priority: newPriority } : apt
        )
      );

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating priority:", error);
    } finally {
      setUpdatingPriority(null);
    }
  };

  // Success toast component
  const SuccessToast = () => (
    <div
      className={`position-fixed top-0 end-0 p-3 ${
        showSuccess ? "opacity-100" : "opacity-0"
      }`}
      style={{ zIndex: 1050, transition: "opacity 0.3s ease-in-out" }}
    >
      <div className="toast show bg-success text-white">
        <div className="toast-body d-flex align-items-center">
          <CheckCircle size={16} className="me-2" />
          Priority updated successfully
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-fluid bg-gray-900 min-vh-100 px-3 px-md-4 py-4">
      {/* Success Toast */}
      <div className={`toast-container ${showSuccess ? "show" : ""}`}>
        <div className="toast-content bg-success">
          <CheckCircle size={16} />
          <span>Priority updated successfully</span>
        </div>
      </div>

      {/* Filters Section */}
      <div className="card bg-gray-800 border-0 shadow-lg mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12 col-md-6">
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

            <div className="col-12 col-md-6 col-lg-3">
              <select
                className="form-select bg-gray-700 border-0 text-white w-100"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
                <option value="high severe">High Severe</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4">
        {loading ? (
          <div className="col-12 d-flex justify-content-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="col-12 text-center py-5 text-gray-400">
            <h5>No Appointments Found</h5>
            <p>Try adjusting your filters or search terms</p>
          </div>
        ) : (
          filteredAppointments.map((appointment, index) => (
            <div key={index} className="col">
              <div
                className="card bg-gray-700 border-0 shadow-sm h-100"
                onClick={() => handleViewClick(appointment)}
                style={{ cursor: "pointer" }}
              >
                <div className="card-body p-3 d-flex flex-column align-items-center">
                  {/* Avatar Section */}
                  <div className="position-relative mb-3">
                    <img
                      src={
                        appointment?.patient?.avatar?.url ||
                        appointment?.patient?.avatar ||
                        "default-avatar.png"
                      }
                      alt="Patient Avatar"
                      className="rounded-circle"
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                      }}
                    />
                    <span
                      className={`position-absolute bottom-0 end-0 p-1 rounded-circle ${getStatusBadgeColor(
                        appointment.appointmentStatus
                      )}`}
                      style={{ width: "12px", height: "12px" }}
                    />
                  </div>

                  {/* Patient Info */}
                  <h6 className="text-white mb-2 text-center w-100 text-truncate">
                    {appointment.patient.name}
                  </h6>
                  <span
                    className={`badge ${
                      getPriorityConfig(appointment.priority).color
                    } mb-3`}
                  >
                    {appointment.priority} Priority
                  </span>

                  {/* Priority Select */}
                  <div className="d-flex align-items-center gap-2 w-100 mb-3">
                    <select
                      className="form-select form-select-sm bg-gray-700 border-gray-600 text-white flex-grow-1"
                      value={appointment.priority.toLowerCase()}
                      onChange={(e) =>
                        handlePriorityChange(appointment._id, e.target.value, e)
                      }
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="low">Low Priority</option>
                      <option value="moderate">Moderate Priority</option>
                      <option value="severe">Severe Priority</option>
                      <option value="high severe">High Severe Priority</option>
                    </select>
                    {updatingPriority === appointment._id && (
                      <div className="spinner-border spinner-border-sm text-primary" />
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="d-flex flex-wrap gap-2 justify-content-center w-100">
                    <button
                      className="btn btn-gray-600 btn-sm d-flex align-items-center gap-2 flex-grow-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewClick(appointment);
                      }}
                    >
                      <MessageSquare size={14} />
                      Chat
                    </button>
                    <button
                      className="btn btn-gray-600 btn-sm d-flex align-items-center gap-2 flex-grow-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAppointment(appointment);
                        setShowNotesModal(true);
                      }}
                    >
                      <FileText size={14} />
                      Notes
                    </button>
                    <button
                      className="btn btn-gray-600 btn-sm d-flex align-items-center gap-2 flex-grow-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAppointment(appointment);
                        setShowSummaryModal(true);
                      }}
                    >
                      <ClipboardList size={14} />
                      Summary
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      <NotesModal
        show={showNotesModal}
        onHide={() => setShowNotesModal(false)}
        appointment={selectedAppointment}
      />
      <SummaryModal
        show={showSummaryModal}
        onHide={() => setShowSummaryModal(false)}
        appointment={selectedAppointment}
      />

      <style jsx>{`
        body,
        html {
          background-color: #1a202c; /* This is the equivalent of Tailwind's bg-gray-900 */
          margin: 0;
          padding: 0;
        }
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
        .toast-container {
          position: fixed;
          top: 1rem;
          right: 1rem;
          z-index: 1050;
          opacity: 0;
          transform: translateY(-0.5rem);
          transition: all 0.3s ease-in-out;
        }

        .toast-container.show {
          opacity: 1;
          transform: translateY(0);
        }

        .toast-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          color: white;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        @media (max-width: 576px) {
          .card-body {
            padding: 1rem;
          }

          .btn-group {
            flex-direction: column;
            width: 100%;
          }

          .form-select {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Patients;
