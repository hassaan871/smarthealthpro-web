import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  MessageSquare,
  PlusSquare,
  ClipboardList,
  CheckCircle,
  Loader2,
} from "lucide-react";
import Context from "../context/context";
import { getPriorityConfig, getStatusConfig } from "../../colorsConfig";
import { encrypt, decrypt } from "../encrypt/Encrypt";

const AppointmentProgressWidget = ({ fromOverview }) => {
  const { appointments, setAppointments } = useContext(Context);
  const location = useLocation();
  const tab = location.state?.activeTab || "today";
  const [activeTab, setActiveTab] = useState(tab);
  const [error, setError] = useState(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [prescriptions, setPrescriptions] = useState({});
  const [statusFilter, setStatusFilter] = useState("all");
  const [prescriptionData, setPrescriptionData] = useState({
    prescription: [
      {
        medication: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      },
    ],
  });
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState(null);
  const [isPrioritySaving, setIsPrioritySaving] = useState(false);
  const [showPrioritySuccess, setShowPrioritySuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // State to store prescriptions and notes
  const [medicalRecords, setMedicalRecords] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top
  }, []);

  const handleEditPrescription = (prescription) => {
    setIsEditing(true);
    setEditingPrescription(prescription);
  };

  const handleSaveEdit = async (record, prescription) => {
    // console.log("editted prescription: ", editingPrescription);
    // console.log("prescription: ", prescription);
    setIsSaving(true);
    try {
      const encryptedPrescription = {
        ...editingPrescription,
        medication: encrypt(editingPrescription.medication),
        dosage: encrypt(editingPrescription.dosage),
        frequency: encrypt(editingPrescription.frequency),
        duration: encrypt(editingPrescription.duration),
        instructions: encrypt(editingPrescription.instructions),
      };

      const response = await fetch(
        `http://localhost:5000/appointment/${record.appointmentId}/prescriptions/${prescription.id}`, // Adjust the URL to match the API
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(encryptedPrescription), // Send the updated prescription object
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update prescription");
      }

      // Refresh prescriptions data
      handleViewRecords(selectedAppointment);
      setIsEditing(false);
      setEditingPrescription(null);
      setShowViewModal(false);

      // Show success toast
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    } catch (error) {
      console.error("Error updating prescription:", error);
    } finally {
      setIsSaving(false);
    }
  };

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

  useEffect(() => {
    localStorage.setItem("medicalRecords", JSON.stringify(medicalRecords));
  }, [medicalRecords]);

  const handleAddPrescription = (appointment) => {
    setSelectedAppointment(appointment);
    setShowPrescriptionModal(true);
  };

  // Update the handleViewRecords function
  const handleViewRecords = (appointment) => {
    setSelectedAppointment(appointment);
    setShowViewModal(true);
    setLoading(true);

    const link = `http://localhost:5000/appointment/${appointment.patient.id}/prescription`;
    console.log("link is: ", link);

    fetch(link)
      .then((response) => response.json())
      .then((data) => {
        console.log("Prescription data from API:", data);
        const decryptedPrescriptions = data.data.map((record) => ({
          ...record,
          prescriptions: record.prescriptions.map((prescription) => ({
            ...prescription,
            medication: decrypt(prescription.medication),
            dosage: decrypt(prescription.dosage),
            frequency: decrypt(prescription.frequency),
            duration: decrypt(prescription.duration),
            instructions: decrypt(prescription.instructions),
          })),
        }));

        setPrescriptions(decryptedPrescriptions);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching prescriptions:", error);
        setPrescriptions({
          success: false,
          message: "Failed to fetch prescriptions",
          data: [],
        });
      });
  };
  const savePrescription = async () => {
    if (!selectedAppointment) return;

    setIsSaving(true); // Start loading

    const encryptedPrescription = prescriptionData.prescription.map(
      (medicine) => ({
        medication: encrypt(medicine.medication),
        dosage: encrypt(medicine.dosage),
        frequency: encrypt(medicine.frequency),
        duration: encrypt(medicine.duration),
        instructions: encrypt(medicine.instructions),
      })
    );
    const body = {
      prescription: encryptedPrescription,
    };

    console.log("body is: ", body);
    try {
      const response = await fetch(
        `http://localhost:5000/appointment/${selectedAppointment._id}/prescription`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save prescription");
      }

      setShowPrescriptionModal(false);

      // Show success toast
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000); // Hide after 3 seconds
    } catch (error) {
      console.error("Error saving prescription:", error);
      // You might want to show an error toast here as well
    } finally {
      setIsSaving(false); // End loading
    }
  };

  const SuccessToast = () => (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        showSuccessToast
          ? "opacity-100 transform translate-y-0"
          : "opacity-0 transform -translate-y-2 pointer-events-none"
      }`}
    >
      <div className="flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg">
        <CheckCircle className="h-5 w-5" />
        <span className="font-medium">Prescription saved successfully</span>
      </div>
    </div>
  );

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

      // Decrypt conversation data
      const decryptedConversations = conversations.map((conv) => ({
        ...conv,
        messages: conv.messages
          ? conv.messages.map((msg) => ({
              ...msg,
              content: decrypt(msg.content),
            }))
          : [],
      }));

      const existingConversation = decryptedConversations.find(
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
          name: encrypt(appointment?.doctor?.name), // Encrypt doctor name
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

  const getPriorityBadge = (priority) => {
    const config = getPriorityConfig(priority);
    return {
      color: config.color,
      textColor: config.textColor,
      percentage: config.percentage,
    };
  };

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
            {prescriptionData.prescription.map((medicine, index) => (
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
                          prescription: prev.prescription.filter(
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
                        prescription: prev.prescription.map((m, i) =>
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
                        prescription: prev.prescription.map((m, i) =>
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
                        prescription: prev.prescription.map((m, i) =>
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
                        prescription: prev.prescription.map((m, i) =>
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
                        prescription: prev.prescription.map((m, i) =>
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
                  prescription: [
                    ...prev.prescription,
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
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary d-flex align-items-center gap-2"
              onClick={savePrescription}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Prescription"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Update the renderViewModal function
  const renderViewModal = () => {
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
                onClick={() => {
                  setShowViewModal(false);
                  setIsEditing(false);
                  setEditingPrescription(null);
                }}
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-4">
                <h6 className="text-lg font-semibold mb-3">Prescriptions</h6>
                {loading ? (
                  <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : prescriptions?.length > 0 ? (
                  prescriptions.map((record, recordIndex) => (
                    <div key={recordIndex} className="mb-4">
                      <div className="bg-gray-700 p-4 rounded">
                        {/* Appointment Info Header */}
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div>
                            <h6 className="font-medium mb-1">
                              Doctor: {record?.doctorName}
                            </h6>
                            <p className="text-sm text-gray-400 mb-0">
                              Patient: {record?.patientName}
                            </p>
                          </div>
                          <div className="text-end">
                            <div className="text-sm text-gray-400">
                              Date: {record?.date}
                            </div>
                            <div className="text-sm text-gray-400">
                              Time: {record?.time}
                            </div>
                          </div>
                        </div>

                        {/* Prescriptions */}
                        <div className="space-y-3">
                          {record.prescriptions.map((prescription, index) => (
                            <div
                              key={index}
                              className="border border-gray-600 rounded p-3 mt-3"
                            >
                              {isEditing &&
                              editingPrescription?._id === prescription._id ? (
                                // Editing Form
                                <div>
                                  <div className="mb-3">
                                    <label className="form-label">
                                      Medication
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control bg-gray-700 border-gray-600 text-white"
                                      value={editingPrescription.medication}
                                      onChange={(e) =>
                                        setEditingPrescription({
                                          ...editingPrescription,
                                          medication: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="row mb-3">
                                    <div className="col-md-4">
                                      <label className="form-label">
                                        Dosage
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control bg-gray-700 border-gray-600 text-white"
                                        value={editingPrescription.dosage}
                                        onChange={(e) =>
                                          setEditingPrescription({
                                            ...editingPrescription,
                                            dosage: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                    <div className="col-md-4">
                                      <label className="form-label">
                                        Frequency
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control bg-gray-700 border-gray-600 text-white"
                                        value={editingPrescription.frequency}
                                        onChange={(e) =>
                                          setEditingPrescription({
                                            ...editingPrescription,
                                            frequency: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                    <div className="col-md-4">
                                      <label className="form-label">
                                        Duration
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control bg-gray-700 border-gray-600 text-white"
                                        value={editingPrescription.duration}
                                        onChange={(e) =>
                                          setEditingPrescription({
                                            ...editingPrescription,
                                            duration: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="mb-3">
                                    <label className="form-label">
                                      Instructions
                                    </label>
                                    <textarea
                                      className="form-control bg-gray-700 border-gray-600 text-white"
                                      value={editingPrescription.instructions}
                                      onChange={(e) =>
                                        setEditingPrescription({
                                          ...editingPrescription,
                                          instructions: e.target.value,
                                        })
                                      }
                                      rows="3"
                                    ></textarea>
                                  </div>
                                  <div className="d-flex justify-content-end gap-2">
                                    <button
                                      className="btn btn-secondary"
                                      onClick={() => {
                                        setIsEditing(false);
                                        setEditingPrescription(null);
                                      }}
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      className="btn btn-primary d-flex align-items-center gap-2"
                                      onClick={() => {
                                        // console.log("record: ", record);
                                        handleSaveEdit(record, prescription);
                                      }}
                                      disabled={isSaving}
                                    >
                                      {isSaving ? (
                                        <>
                                          <Loader2
                                            size={16}
                                            className="animate-spin"
                                          />
                                          Saving...
                                        </>
                                      ) : (
                                        "Save Changes"
                                      )}
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                // View Mode
                                <>
                                  <div className="d-flex justify-content-between align-items-start mb-2">
                                    <h6 className="font-medium mb-0">
                                      {prescription.medication}
                                    </h6>
                                    <button
                                      className="btn btn-sm btn-gray-600"
                                      onClick={() =>
                                        handleEditPrescription(prescription)
                                      }
                                    >
                                      Edit
                                    </button>
                                  </div>
                                  <div className="row mb-2">
                                    <div className="col-md-4">
                                      <span className="text-gray-400">
                                        Dosage:
                                      </span>{" "}
                                      {prescription.dosage}
                                    </div>
                                    <div className="col-md-4">
                                      <span className="text-gray-400">
                                        Frequency:
                                      </span>{" "}
                                      {prescription.frequency}
                                    </div>
                                    <div className="col-md-4">
                                      <span className="text-gray-400">
                                        Duration:
                                      </span>{" "}
                                      {prescription.duration}
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-300 mb-0">
                                    <span className="text-gray-400">
                                      Instructions:
                                    </span>{" "}
                                    {prescription.instructions}
                                  </p>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">
                    {selectedAppointment
                      ? "No prescriptions found for this appointment."
                      : "Loading prescriptions..."}
                  </p>
                )}
              </div>
            </div>
            <div className="modal-footer border-gray-700">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setShowViewModal(false);
                  setIsEditing(false);
                  setEditingPrescription(null);
                }}
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

  const handlePriorityChange = async (appointmentId, newPriority) => {
    setIsPrioritySaving(true);
    try {
      const response = await fetch(
        `http://localhost:5000/appointment/updateAppointment/${appointmentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            priority: newPriority,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update priority");

      // Update local state
      setAppointments((prevAppointments) =>
        prevAppointments.map((apt) =>
          apt._id === appointmentId ? { ...apt, priority: newPriority } : apt
        )
      );

      setShowPrioritySuccess(true);
      setTimeout(() => setShowPrioritySuccess(false), 3000);
    } catch (error) {
      console.error("Error updating priority:", error);
    } finally {
      setIsPrioritySaving(false);
    }
  };

  const PrioritySuccessToast = () => (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        showPrioritySuccess
          ? "opacity-100 transform translate-y-0"
          : "opacity-0 transform -translate-y-2 pointer-events-none"
      }`}
    >
      <div className="d-flex items-center gap-2 bg-success text-white px-4 py-3 rounded shadow">
        <CheckCircle className="h-5 w-5" />
        <span className="font-medium">Priority updated successfully</span>
      </div>
    </div>
  );

  return (
    <div
      className="container-fluid bg-gray-900 px-4 py-5"
      style={{ minHeight: "100vh" }}
    >
      <SuccessToast />
      <div className="card bg-gray-800 border-0 shadow-lg mb-4">
        {/* Header Section */}
        <div className="card-header bg-gray-800 border-bottom border-gray-700 p-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
            <h3 className="card-title text-white mb-0">
              Comprehensive Appointment Progress
            </h3>

            {/* Status Filter */}
            <div className="col-12 col-md-3">
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

            {/* Tab Buttons */}
            <div className="btn-group w-100 w-md-auto">
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

        {/* Appointments List */}
        <div className="card-body p-4">
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
                <div className="card-body p-4">
                  <div className="row g-4">
                    {/* Patient Avatar Section */}
                    <div className="col-12 col-md-2 d-flex align-items-center justify-content-center">
                      <div className="position-relative">
                        <img
                          src={
                            apt.patient.avatar?.url ||
                            apt.patient.avatar ||
                            "default-avatar.png"
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

                    {/* Appointment Details Section */}
                    <div className="col-12 col-md-10">
                      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-3">
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

                      {/* Date, Time, Location */}
                      <div className="row mb-3">
                        <div className="col-12 col-md-4 mb-2 mb-md-0">
                          <div className="d-flex align-items-center text-gray-400">
                            <Calendar size={16} className="me-2" />
                            {apt.date || "Not scheduled"}
                          </div>
                        </div>
                        <div className="col-12 col-md-4 mb-2 mb-md-0">
                          <div className="d-flex align-items-center text-gray-400">
                            <Clock size={16} className="me-2" />
                            {apt.time || "Not scheduled"}
                          </div>
                        </div>
                        <div className="col-12 col-md-4">
                          <div className="d-flex align-items-center text-gray-400">
                            <MapPin size={16} className="me-2" />
                            {apt.location || "Location TBD"}
                          </div>
                        </div>
                      </div>

                      {/* Priority Progress Bar */}
                      <div className="progress mb-3" style={{ height: "6px" }}>
                        <div
                          className={`progress-bar ${
                            getPriorityConfig(apt.priority).color
                          }`}
                          role="progressbar"
                          style={{
                            width: `${
                              getPriorityConfig(apt.priority).percentage
                            }%`,
                          }}
                          aria-valuenow={
                            getPriorityConfig(apt.priority).percentage
                          }
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>

                      {/* Bottom Section */}
                      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-3">
                        {/* Priority Badge and Booking Date */}
                        <div className="d-flex align-items-center gap-3">
                          <span
                            className={`badge ${
                              getPriorityConfig(apt.priority).color
                            }`}
                          >
                            {apt.priority} Priority
                          </span>
                          <small className="text-gray-400">
                            Booked:{" "}
                            {new Date(apt.bookedOn).toLocaleDateString()}
                          </small>
                        </div>

                        {/* Priority Select */}
                        <div className="d-flex align-items-center gap-2">
                          <select
                            className="form-select bg-gray-700 border-gray-600 text-white"
                            value={apt.priority}
                            onChange={(e) =>
                              handlePriorityChange(apt._id, e.target.value)
                            }
                            disabled={isPrioritySaving}
                          >
                            <option value="low">Low Priority</option>
                            <option value="moderate">Moderate Priority</option>
                            <option value="severe">Severe Priority</option>
                            <option value="high severe">
                              High Severe Priority
                            </option>
                          </select>
                          {isPrioritySaving && (
                            <div className="spinner-border spinner-border-sm text-primary">
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="d-flex flex-wrap gap-2">
                          <button
                            className="btn btn-indigo d-flex align-items-center gap-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddPrescription(apt);
                            }}
                            // disabled={apt.appointmentStatus !== "visited"}
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
                            // disabled={apt.appointmentStatus !== "visited"}
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
      </div>
      {renderPrescriptionModal()}
      {renderViewModal()}

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
        .fixed {
          position: fixed;
        }

        .z-50 {
          z-index: 50;
        }

        .transition-all {
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }

        .duration-300 {
          transition-duration: 300ms;
        }

        .transform {
          transform: translateY(0);
        }

        .-translate-y-2 {
          transform: translateY(-0.5rem);
        }

        .bg-green-600 {
          background-color: #059669;
        }

        .rounded-lg {
          border-radius: 0.5rem;
        }

        .shadow-lg {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        .flex {
          display: flex;
        }

        .items-center {
          align-items: center;
        }

        .gap-2 {
          gap: 0.5rem;
        }

        .px-4 {
          padding-left: 1rem;
          padding-right: 1rem;
        }

        .py-3 {
          padding-top: 0.75rem;
          padding-bottom: 0.75rem;
        }

        .font-medium {
          font-weight: 500;
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

        /* Override select dropdown styles */
        select option {
          background-color: #374151;
          color: #fff;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        /* Hide scrollbar while maintaining functionality */
        ::-webkit-scrollbar {
          display: none;
        }

        /* For Firefox */
        * {
          scrollbar-width: none;
        }

        /* For IE/Edge */
        * {
          -ms-overflow-style: none;
        }
      `}</style>
    </div>
  );
};

export default AppointmentProgressWidget;
