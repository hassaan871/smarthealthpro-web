import React, { useState, useEffect, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AdminNavbar from "./AdminNavbar";
import axios from "axios";

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorToDelete, setDoctorToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/user/getAllDoctors"
        );
        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
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

    .doctor-card {
      transition: all 0.3s ease;
      border: none;
      background: #2a2a2a;
      border: 1px solid #404040;
    }
    
    .doctor-card:hover {
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

    .doctor-list-container {
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

  const filteredDoctors = useMemo(() => {
    if (!searchTerm) return doctors;
    const searchTermLower = searchTerm.toLowerCase();
    return doctors.filter(
      (doctor) =>
        doctor.user.fullName.toLowerCase().includes(searchTermLower) ||
        doctor.user.email.toLowerCase().includes(searchTermLower) ||
        doctor.user.userName.toLowerCase().includes(searchTermLower)
    );
  }, [searchTerm, doctors]);

  const handleDeleteDoctor = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(
        `http://localhost:5000/user/deleteUser/${doctorToDelete.user._id}`
      );
      setDoctors(
        doctors.filter((doctor) => doctor.user._id !== doctorToDelete.user._id)
      );
      setDoctorToDelete(null);
      setSelectedDoctor(null);
    } catch (error) {
      console.error("Error deleting doctor:", error);
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
              Doctor Management
            </h1>
            <p className="text-light-custom">
              Monitor and manage registered doctors
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

        {/* Doctor List */}
        <div className="doctor-list-container p-4">
          <div className="row g-4">
            {filteredDoctors.map((doctor) => (
              <div key={doctor._id} className="col-md-6">
                <div
                  className="doctor-card p-4 rounded-3 cursor-pointer"
                  onClick={() => setSelectedDoctor(doctor)}
                >
                  <div className="d-flex align-items-center">
                    <img
                      src={doctor.user.avatar.url || doctor.user.avatar}
                      alt={doctor.user.fullName}
                      className="rounded-circle me-3"
                      style={{
                        width: "70px",
                        height: "70px",
                        objectFit: "cover",
                      }}
                    />
                    <div className="flex-grow-1">
                      <h5 className="text-light-custom mb-1">
                        {doctor.user.fullName}
                      </h5>
                      <div className="d-flex align-items-center mb-2">
                        <small className="text-muted-custom me-3">
                          @{doctor.user.userName}
                        </small>
                        <span className="blood-type-badge">
                          {doctor.specialization}
                        </span>
                      </div>
                      <small className="text-muted-custom d-block">
                        {doctor.user.email}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredDoctors.length === 0 && (
            <div className="text-center py-5">
              <div className="text-light-custom">
                <i className="bi bi-search mb-3 display-4"></i>
                <p className="mb-0">
                  No doctors found matching your search criteria
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Doctor Details Modal */}
        {selectedDoctor && (
          <div className="modal show d-block custom-modal">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content dark-modal">
                <div className="modal-header border-0">
                  <h4 className="modal-title">
                    {selectedDoctor.user?.fullName}
                  </h4>
                  <button
                    className="btn-close btn-close-white"
                    onClick={() => setSelectedDoctor(null)}
                  ></button>
                </div>
                <div className="modal-body p-4">
                  <div className="row">
                    <div className="col-md-4 text-center mb-4 mb-md-0">
                      <img
                        src={
                          selectedDoctor.user?.avatar.url ||
                          selectedDoctor.user?.avatar
                        }
                        alt={selectedDoctor.user?.fullName}
                        className="rounded-circle mb-3"
                        style={{
                          width: "150px",
                          height: "150px",
                          objectFit: "cover",
                        }}
                      />
                      <h5 className="text-light-custom mb-2">
                        @{selectedDoctor.user?.userName}
                      </h5>
                      <span className="blood-type-badge">
                        {selectedDoctor.specialization}
                      </span>
                    </div>
                    <div className="col-md-8">
                      <div className="info-card p-4">
                        <h5 className="text-light-custom mb-4">
                          Doctor Information
                        </h5>
                        <div className="row g-3">
                          <div className="col-sm-6">
                            <p className="mb-1 text-light-custom">
                              <strong>Email</strong>
                            </p>
                            <p className="text-muted-custom">
                              {selectedDoctor.user?.email}
                            </p>
                          </div>
                          <div className="col-sm-6">
                            <p className="mb-1 text-light-custom">
                              <strong>Role</strong>
                            </p>
                            <p className="text-muted-custom">
                              {selectedDoctor.user?.role
                                ?.charAt(0)
                                .toUpperCase() +
                                selectedDoctor.user?.role?.slice(1)}
                            </p>
                          </div>
                          <div className="col-sm-6">
                            <p className="mb-1 text-light-custom">
                              <strong>Specialization</strong>
                            </p>
                            <p className="text-muted-custom">
                              {selectedDoctor.specialization}
                            </p>
                          </div>
                          <div className="col-sm-6">
                            <p className="mb-1 text-light-custom">
                              <strong>Address</strong>
                            </p>
                            <p className="text-muted-custom">
                              {selectedDoctor.address}
                            </p>
                          </div>
                          <div className="col-sm-6">
                            <p className="mb-1 text-light-custom">
                              <strong>Rating</strong>
                            </p>
                            <p className="text-muted-custom">
                              {selectedDoctor.rating}
                            </p>
                          </div>
                          <div className="col-sm-6">
                            <p className="mb-1 text-light-custom">
                              <strong>Office Hours</strong>
                            </p>
                            <p className="text-muted-custom">
                              {Object.entries(selectedDoctor.officeHours).map(
                                ([day, hours]) => (
                                  <div key={day}>
                                    <strong>{day}:</strong> {hours}
                                  </div>
                                )
                              )}
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
                    onClick={() => setDoctorToDelete(selectedDoctor)}
                  >
                    Delete Doctor
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => setSelectedDoctor(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {doctorToDelete && (
          <div className="modal show d-block custom-modal">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content dark-modal">
                <div className="modal-header border-0">
                  <h5 className="modal-title text-danger">Confirm Deletion</h5>
                  <button
                    className="btn-close btn-close-white"
                    onClick={() => setDoctorToDelete(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="text-center mb-4">
                    <img
                      src={
                        doctorToDelete.user?.avatar.url ||
                        doctorToDelete.user?.avatar
                      }
                      alt={doctorToDelete.user?.fullName}
                      className="rounded-circle mb-3"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                      }}
                    />
                    <h5 className="text-light-custom mb-1">
                      {doctorToDelete.user?.fullName}
                    </h5>
                    <p className="text-muted-custom">
                      @{doctorToDelete.user?.userName}
                    </p>
                  </div>
                  <div className="alert alert-danger bg-danger bg-opacity-10">
                    <p className="mb-0 text-center">
                      Are you sure you want to permanently delete this doctor's
                      account?
                      <br />
                      <small>This action cannot be undone.</small>
                    </p>
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button
                    className="btn btn-outline-secondary text-light-custom"
                    onClick={() => setDoctorToDelete(null)}
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={handleDeleteDoctor}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete Doctor"}
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

export default AdminDoctors;
