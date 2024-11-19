import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  MessageSquare,
  PlusSquare,
  ClipboardList,
} from "lucide-react";
import Context from "../context/context";

const AppointmentProgressWidget = () => {
  const { appointments, setAppointments } = useContext(Context);
  const [activeTab, setActiveTab] = useState("today");
  const [error, setError] = useState(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [prescriptions, setPrescriptions] = useState({});
  const [statusFilter, setStatusFilter] = useState("all");
  const [prescriptionData, setPrescriptionData] = useState({
    medicines: [
      {
        medication: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      },
    ],
  });

  // State to store prescriptions and notes
  const [medicalRecords, setMedicalRecords] = useState({});
  const navigate = useNavigate();

  const isToday = (date) => {
    const today = new Date();
    const appointmentDate = new Date(date);
    return (
      appointmentDate.getDate() === today.getDate() &&
      appointmentDate.getMonth() === today.getMonth() &&
      appointmentDate.getFullYear() === today.getFullYear()
    );
  };

  const isThisWeek = (date) => {
    const today = new Date();
    const appointmentDate = new Date(date);
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // End of week (Saturday)

    return appointmentDate >= weekStart && appointmentDate <= weekEnd;
  };

  const isThisMonth = (date) => {
    const today = new Date();
    const appointmentDate = new Date(date);
    return (
      appointmentDate.getMonth() === today.getMonth() &&
      appointmentDate.getFullYear() === today.getFullYear()
    );
  };

  const getFilteredAppointments = () => {
    return appointments.filter((apt) => {
      const appointmentDate = apt.date;
      const matchesStatus =
        statusFilter === "all" ||
        apt.appointmentStatus.toLowerCase() === statusFilter.toLowerCase();

      switch (activeTab) {
        case "today":
          return isToday(appointmentDate) && matchesStatus;
        case "week":
          return isThisWeek(appointmentDate) && matchesStatus;
        case "month":
          return isThisMonth(appointmentDate) && matchesStatus;
        case "all":
          return matchesStatus; // Only filter by status when showing all dates
        default:
          return matchesStatus;
      }
    });
  };
  useEffect(() => {
    // Demo data for prescriptions
    const demoMedicalRecords = {
      apt1: {
        prescriptions: [
          {
            id: "1",
            medication: "Amoxicillin",
            dosage: "500mg",
            frequency: "Twice daily",
            duration: "7 days",
            instructions: "Take with food",
            date: "2024-03-15T10:30:00.000Z",
          },
          {
            id: "2",
            medication: "Ibuprofen",
            dosage: "400mg",
            frequency: "Every 6 hours as needed",
            duration: "5 days",
            instructions: "Take with food. Do not exceed 4 doses in 24 hours",
            date: "2024-03-15T10:35:00.000Z",
          },
        ],
      },
      apt2: {
        prescriptions: [
          {
            id: "3",
            medication: "Ciprofloxacin",
            dosage: "250mg",
            frequency: "Once daily",
            duration: "10 days",
            instructions: "Complete full course of antibiotics",
            date: "2024-03-14T15:20:00.000Z",
          },
        ],
      },
    };

    // Merge demo data with any existing records
    setMedicalRecords((prev) => ({
      ...demoMedicalRecords,
      ...prev,
    }));
  }, []); // Empty dependency array means this runs once on component mount

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const userString = localStorage.getItem("userToken");
        if (!userString) throw new Error("User data not found");
        const doctorId = userString;
        if (!doctorId) throw new Error("Doctor ID not found");

        // Fetch appointments
        const response = await fetch(
          `http://localhost:5000/appointment/getAppointmentsByDoctorId/${doctorId}`
        );
        if (!response.ok) throw new Error("Failed to fetch appointments");
        const data = await response.json();
        const pendingAppointments = data.filter(
          (apt) => apt.appointmentStatus === "pending"
        );
        setAppointments(pendingAppointments);

        // Fetch prescriptions for each appointment
        const prescriptionsData = {};
        for (const apt of pendingAppointments) {
          try {
            const presResponse = await fetch(
              `http://localhost:5000/appointment/${apt._id}/medicines`
            );
            if (presResponse.ok) {
              const presData = await presResponse.json();
              prescriptionsData[apt._id] = presData;
            }
          } catch (error) {
            console.error(
              `Error fetching prescriptions for appointment ${apt._id}:`,
              error
            );
            prescriptionsData[apt._id] = []; // Initialize with empty array if fetch fails
          }
        }
        setPrescriptions(prescriptionsData);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchAppointments();
  }, []);

  useEffect(() => {
    localStorage.setItem("medicalRecords", JSON.stringify(medicalRecords));
  }, [medicalRecords]);

  const handleAddPrescription = (appointment) => {
    setSelectedAppointment(appointment);
    setShowPrescriptionModal(true);
  };

  // Update the handleViewRecords function
  const handleViewRecords = (appointment) => {
    console.log("Selected appointment for view:", appointment);
    setSelectedAppointment(appointment);
    setShowViewModal(true);

    // Fetch prescriptions for this appointment
    fetch(`http://localhost:5000/appointment/${appointment._id}/medicines`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Raw API Response:", data);
        console.log("Medicines from API:", data.data.medicines);
        setPrescriptions((prev) => ({
          ...prev,
          [appointment._id]: data.data.medicines, // Store the medicines array directly
        }));
      })
      .catch((error) => {
        console.error("Error fetching prescriptions:", error);
      });
  };

  const savePrescription = async () => {
    if (!selectedAppointment) return;

    try {
      const response = await fetch(
        `http://localhost:5000/appointment/${selectedAppointment._id}/medicines`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            medicines: prescriptionData.medicines.map((medicine) => ({
              medication: medicine.medication,
              dosage: medicine.dosage,
              frequency: medicine.frequency,
              duration: medicine.duration,
              instructions: medicine.instructions,
            })),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save prescription");
      }

      const savedResponse = await response.json();
      console.log("Save Response:", savedResponse);

      // Fetch updated prescriptions after saving
      const updatedPresResponse = await fetch(
        `http://localhost:5000/appointment/${selectedAppointment._id}/medicines`
      );

      if (!updatedPresResponse.ok) {
        throw new Error("Failed to fetch updated prescriptions");
      }

      const updatedData = await updatedPresResponse.json();
      console.log("Updated Prescriptions Response:", updatedData);

      // Update local state with new prescriptions
      setPrescriptions((prev) => ({
        ...prev,
        [selectedAppointment._id]: updatedData.data.medicines, // Store the medicines array directly
      }));

      // Reset form and close modal
      setPrescriptionData({
        medicines: [
          {
            medication: "",
            dosage: "",
            frequency: "",
            duration: "",
            instructions: "",
          },
        ],
      });
      setShowPrescriptionModal(false);

      // Show success message
      alert("Prescription saved successfully");
    } catch (error) {
      console.error("Error saving prescription:", error);
      alert("Failed to save prescription. Please try again.");
    }
  };

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

  const renderPrescriptionModal = () => (
    <div
      className={`modal ${showPrescriptionModal ? "show d-block" : ""}`}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content bg-gray-800 text-white">
          <div className="modal-header border-gray-700">
            <h5 className="modal-title">Add Prescription</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={() => setShowPrescriptionModal(false)}
            ></button>
          </div>
          <div className="modal-body">
            {prescriptionData.medicines.map((medicine, index) => (
              <div
                key={index}
                className="mb-4 p-3 border border-gray-700 rounded"
              >
                <div className="d-flex justify-content-between mb-3">
                  <h6 className="text-white">Medicine {index + 1}</h6>
                  {index > 0 && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        setPrescriptionData((prev) => ({
                          medicines: prev.medicines.filter(
                            (_, i) => i !== index
                          ),
                        }));
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Medication</label>
                  <input
                    type="text"
                    className="form-control bg-gray-700 border-gray-600 text-white"
                    value={medicine.medication}
                    onChange={(e) => {
                      setPrescriptionData((prev) => ({
                        medicines: prev.medicines.map((m, i) =>
                          i === index ? { ...m, medication: e.target.value } : m
                        ),
                      }));
                    }}
                    placeholder="Enter medication name"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Dosage</label>
                  <input
                    type="text"
                    className="form-control bg-gray-700 border-gray-600 text-white"
                    value={medicine.dosage}
                    onChange={(e) => {
                      setPrescriptionData((prev) => ({
                        medicines: prev.medicines.map((m, i) =>
                          i === index ? { ...m, dosage: e.target.value } : m
                        ),
                      }));
                    }}
                    placeholder="Enter dosage"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Frequency</label>
                  <input
                    type="text"
                    className="form-control bg-gray-700 border-gray-600 text-white"
                    value={medicine.frequency}
                    onChange={(e) => {
                      setPrescriptionData((prev) => ({
                        medicines: prev.medicines.map((m, i) =>
                          i === index ? { ...m, frequency: e.target.value } : m
                        ),
                      }));
                    }}
                    placeholder="Enter frequency"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Duration</label>
                  <input
                    type="text"
                    className="form-control bg-gray-700 border-gray-600 text-white"
                    value={medicine.duration}
                    onChange={(e) => {
                      setPrescriptionData((prev) => ({
                        medicines: prev.medicines.map((m, i) =>
                          i === index ? { ...m, duration: e.target.value } : m
                        ),
                      }));
                    }}
                    placeholder="Enter duration"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Instructions</label>
                  <textarea
                    className="form-control bg-gray-700 border-gray-600 text-white"
                    value={medicine.instructions}
                    onChange={(e) => {
                      setPrescriptionData((prev) => ({
                        medicines: prev.medicines.map((m, i) =>
                          i === index
                            ? { ...m, instructions: e.target.value }
                            : m
                        ),
                      }));
                    }}
                    placeholder="Enter special instructions"
                    rows="3"
                  ></textarea>
                </div>
              </div>
            ))}

            <button
              className="btn btn-secondary w-100"
              onClick={() => {
                setPrescriptionData((prev) => ({
                  medicines: [
                    ...prev.medicines,
                    {
                      medication: "",
                      dosage: "",
                      frequency: "",
                      duration: "",
                      instructions: "",
                    },
                  ],
                }));
              }}
            >
              Add Another Medicine
            </button>
          </div>
          <div className="modal-footer border-gray-700">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowPrescriptionModal(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={savePrescription}
            >
              Save Prescription
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Update the renderViewModal function
  const renderViewModal = () => {
    console.log("Selected Appointment in modal:", selectedAppointment);
    console.log("All Prescriptions:", prescriptions);

    const appointmentPrescriptions =
      selectedAppointment && selectedAppointment._id
        ? prescriptions[selectedAppointment._id] || []
        : [];

    console.log("Final Prescriptions to render:", appointmentPrescriptions);

    return (
      <div
        className={`modal ${showViewModal ? "show d-block" : ""}`}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content bg-gray-800 text-white">
            <div className="modal-header border-gray-700">
              <h5 className="modal-title">Medical Records</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setShowViewModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-4">
                <h6 className="text-lg font-semibold mb-3">Prescriptions</h6>
                {Array.isArray(appointmentPrescriptions) &&
                appointmentPrescriptions.length > 0 ? (
                  <div className="space-y-4">
                    {appointmentPrescriptions.map((prescription, index) => {
                      console.log("Rendering prescription:", prescription);
                      return (
                        <div key={index} className="bg-gray-700 p-4 rounded">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="font-medium mb-0">
                              {prescription.medication || prescription.medicine}
                            </h6>
                            <span className="text-sm text-gray-400">
                              {new Date(
                                prescription.createdAt || new Date()
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="row mb-2">
                            <div className="col-md-4">
                              <span className="text-gray-400">Dosage:</span>{" "}
                              {prescription.dosage}
                            </div>
                            <div className="col-md-4">
                              <span className="text-gray-400">Frequency:</span>{" "}
                              {prescription.frequency}
                            </div>
                            <div className="col-md-4">
                              <span className="text-gray-400">Duration:</span>{" "}
                              {prescription.duration}
                            </div>
                          </div>
                          <p className="text-sm text-gray-300 mb-0">
                            {prescription.instructions}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-400">
                    {selectedAppointment
                      ? "No prescriptions added yet."
                      : "Loading prescriptions..."}
                  </p>
                )}
              </div>
            </div>
            <div className="modal-footer border-gray-700">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Update the savePrescription function
  const filteredAppointments = getFilteredAppointments();

  return (
    <div className="container-fluid bg-gray-900 p-5">
      <div className="card bg-gray-800 border-0 shadow-lg">
        <div className="card-header bg-gray-800 border-bottom border-gray-700">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="card-title text-white mb-0">
              Comprehensive Appointment Progress
            </h3>

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

            <div className="btn-group" role="group">
              {["all", "today", "week", "month"].map((tab) => (
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
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-5 text-gray-400">
              <h5>No Pending Appointments</h5>
              <p>
                {activeTab === "today"
                  ? "There are no appointments scheduled for today"
                  : activeTab === "week"
                  ? "There are no appointments scheduled for this week"
                  : activeTab === "month"
                  ? "There are no appointments scheduled for this month"
                  : "There are no appointments scheduled"}
              </p>
            </div>
          ) : (
            filteredAppointments.map((apt, index) => (
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
                            className="btn btn-indigo d-flex align-items-center gap-2" // New custom class
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddPrescription(apt);
                            }}
                          >
                            <PlusSquare size={16} />
                            Add Prescription
                          </button>
                          <button
                            className="btn btn-primary d-flex align-items-center gap-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewRecords(apt);
                            }}
                          >
                            <ClipboardList size={16} />
                            View Records
                          </button>
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
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {renderPrescriptionModal()}
        {renderViewModal()}
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
        .btn-indigo {
          background-color: #6366f1; /* Indigo color that matches the dark theme */
          border: none;
          color: #ffffff;
        }

        .btn-indigo:hover {
          background-color: #4f46e5; /* Slightly darker indigo on hover */
          color: #ffffff;
        }

        /* Update primary button to be more vibrant */
        .btn-primary {
          background-color: #3b82f6; /* Bright blue */
          border: none;
        }

        .btn-primary:hover {
          background-color: #2563eb; /* Darker blue on hover */
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
