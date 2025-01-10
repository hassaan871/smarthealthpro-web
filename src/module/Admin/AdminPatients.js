import React, { useState, useEffect, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AdminNavbar from "./AdminNavbar";
import axios from "axios";

const AdminPatients = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/user/getAllPatients"
        );
        setPatients(response.data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, []);

  const customStyles = `
    body {
      background: #1a1a1a;
    }

    .text-light-custom {
      color: #ffffff !important;
    }

    .text-muted-custom {
      color: #a0a0a0 !important;
    }

    .patient-card {
      transition: all 0.3s ease;
      border: none;
      background: #2a2a2a;
      border: 1px solid #404040;
    }
    
    .patient-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      background: #2d2d2d;
    }

    .blood-type-badge {
      background: rgba(59, 130, 246, 0.2);
      color: #60a5fa;
      padding: 4px 12px;
      border-radius: 20px;
      font-weight: 600;
    }

    .custom-modal {
      background: rgba(0,0,0,0.8);
      backdrop-filter: blur(5px);
    }

    .dark-modal {
      background: #242424 !important;
    }

    .modal-title {
      color: #ffffff;
    }

    .modal-header {
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      color: #ffffff;
    }

    .info-card {
      background: #2a2a2a;
      border: 1px solid #404040;
      border-radius: 8px;
    }

    .search-container {
      position: relative;
      margin-bottom: 2rem;
    }

    .search-icon {
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translateY(-50%);
      color: #ffffff;
    }

    .custom-search {
      padding-left: 45px !important;
      height: 50px;
      border-radius: 25px;
      background: #2a2a2a !important;
      border: 2px solid #404040 !important;
      color: #ffffff !important;
    }

    .custom-search:focus {
      border-color: #2563eb !important;
      box-shadow: 0 0 0 0.2rem rgba(37,99,235,0.25) !important;
    }

    .custom-search::placeholder {
      color: #808080 !important;
    }

    .patient-list-container {
      background: #242424;
      border-radius: 10px;
      border: 1px solid #404040;
    }

    .btn-primary {
      background-color: #2563eb;
      border-color: #2563eb;
    }

    .btn-primary:hover {
      background-color: #1d4ed8;
      border-color: #1d4ed8;
    }

    .btn-outline-danger {
      color: #dc3545;
      border-color: #dc3545;
    }

    .btn-outline-danger:hover {
      color: #ffffff;
      background-color: #dc3545;
      border-color: #dc3545;
    }
  `;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const filteredPatients = useMemo(() => {
    if (!searchTerm) return patients;
    const searchTermLower = searchTerm.toLowerCase();
    return patients.filter(
      (patient) =>
        patient.user.fullName.toLowerCase().includes(searchTermLower) ||
        patient.user.email.toLowerCase().includes(searchTermLower) ||
        patient.user.userName.toLowerCase().includes(searchTermLower)
    );
  }, [searchTerm, patients]);

  const handleDeletePatient = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(
        `http://localhost:5000/user/deleteUser/${patientToDelete.user._id}`
      );
      setPatients(
        patients.filter(
          (patient) => patient.user._id !== patientToDelete.user._id
        )
      );
      setPatientToDelete(null);
      setSelectedPatient(null);
    } catch (error) {
      console.error("Error deleting patient:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-vh-100" style={{ background: "#1a1a1a" }}>
      <style>{customStyles}</style>
      <AdminNavbar />

      <div className="container py-5">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-md-8">
            <h1 className="display-4 fw-bold text-primary mb-2">
              Patient Management
            </h1>
            <p className="text-light-custom">
              Monitor and manage registered patients
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-container">
          <i className="bi bi-search search-icon"></i>
          <input
            type="text"
            className="form-control custom-search"
            placeholder="Search by name, username, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Patient List */}
        <div className="patient-list-container p-4">
          <div className="row g-4">
            {filteredPatients.map((patient) => (
              <div key={patient._id} className="col-md-6">
                <div
                  className="patient-card p-4 rounded-3 cursor-pointer"
                  onClick={() => setSelectedPatient(patient)}
                >
                  <div className="d-flex align-items-center">
                    <img
                      src={patient.user.avatar}
                      alt={patient.user.fullName}
                      className="rounded-circle me-3"
                      style={{
                        width: "70px",
                        height: "70px",
                        objectFit: "cover",
                      }}
                    />
                    <div className="flex-grow-1">
                      <h5 className="text-light-custom mb-1">
                        {patient.user.fullName}
                      </h5>
                      <div className="d-flex align-items-center mb-2">
                        <small className="text-muted-custom me-3">
                          @{patient.user.userName}
                        </small>
                        <span className="blood-type-badge">
                          {patient.bloodType}
                        </span>
                      </div>
                      <small className="text-muted-custom d-block">
                        {patient.user.email}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPatients.length === 0 && (
            <div className="text-center py-5">
              <div className="text-light-custom">
                <i className="bi bi-search mb-3 display-4"></i>
                <p className="mb-0">
                  No patients found matching your search criteria
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Patient Details Modal */}
        {selectedPatient && (
          <div className="modal show d-block custom-modal">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content dark-modal">
                <div className="modal-header border-0">
                  <h4 className="modal-title">
                    {selectedPatient.user?.fullName}
                  </h4>
                  <button
                    className="btn-close btn-close-white"
                    onClick={() => setSelectedPatient(null)}
                  ></button>
                </div>
                <div className="modal-body p-4">
                  <div className="row">
                    <div className="col-md-4 text-center mb-4 mb-md-0">
                      <img
                        src={selectedPatient.user?.avatar}
                        alt={selectedPatient.user?.fullName}
                        className="rounded-circle mb-3"
                        style={{
                          width: "150px",
                          height: "150px",
                          objectFit: "cover",
                        }}
                      />
                      <h5 className="text-light-custom mb-2">
                        @{selectedPatient.user?.userName}
                      </h5>
                      <span className="blood-type-badge">
                        {selectedPatient.bloodType}
                      </span>
                    </div>
                    <div className="col-md-8">
                      <div className="info-card p-4">
                        <h5 className="text-light-custom mb-4">
                          Patient Information
                        </h5>
                        <div className="row g-3">
                          <div className="col-sm-6">
                            <p className="mb-1 text-light-custom">
                              <strong>Email</strong>
                            </p>
                            <p className="text-muted-custom">
                              {selectedPatient.user?.email}
                            </p>
                          </div>
                          <div className="col-sm-6">
                            <p className="mb-1 text-light-custom">
                              <strong>Gender</strong>
                            </p>
                            <p className="text-muted-custom">
                              {selectedPatient.user?.gender
                                ?.charAt(0)
                                .toUpperCase() +
                                selectedPatient.user?.gender?.slice(1)}
                            </p>
                          </div>
                          <div className="col-sm-6">
                            <p className="mb-1 text-light-custom">
                              <strong>Date of Birth</strong>
                            </p>
                            <p className="text-muted-custom">
                              {formatDate(selectedPatient.dateOfBirth)}
                            </p>
                          </div>
                          <div className="col-sm-6">
                            <p className="mb-1 text-light-custom">
                              <strong>Role</strong>
                            </p>
                            <p className="text-muted-custom">
                              {selectedPatient.user?.role
                                ?.charAt(0)
                                .toUpperCase() +
                                selectedPatient.user?.role?.slice(1)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => setPatientToDelete(selectedPatient)}
                  >
                    Delete Patient
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => setSelectedPatient(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {patientToDelete && (
          <div className="modal show d-block custom-modal">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content dark-modal">
                <div className="modal-header border-0">
                  <h5 className="modal-title text-danger">Confirm Deletion</h5>
                  <button
                    className="btn-close btn-close-white"
                    onClick={() => setPatientToDelete(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="text-center mb-4">
                    <img
                      src={patientToDelete.user?.avatar}
                      alt={patientToDelete.user?.fullName}
                      className="rounded-circle mb-3"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                      }}
                    />
                    <h5 className="text-light-custom mb-1">
                      {patientToDelete.user?.fullName}
                    </h5>
                    <p className="text-muted-custom">
                      @{patientToDelete.user?.userName}
                    </p>
                  </div>
                  <div className="alert alert-danger bg-danger bg-opacity-10">
                    <p className="mb-0 text-center">
                      Are you sure you want to permanently delete this patient's
                      account?
                      <br />
                      <small>This action cannot be undone.</small>
                    </p>
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button
                    className="btn btn-outline-secondary text-light-custom"
                    onClick={() => setPatientToDelete(null)}
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={handleDeletePatient}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete Patient"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPatients;
