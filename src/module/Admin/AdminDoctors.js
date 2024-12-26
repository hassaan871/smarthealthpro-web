import React, { useState, useMemo, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AdminNavbar from "./AdminNavbar";

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorToDelete, setDoctorToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://localhost:5000/user/getAllDoctors');
        if (!response.ok) {
          throw new Error('Failed to fetch doctors');
        }
        const data = await response.json();
        
        // Fetch additional info for each doctor
        const doctorsWithInfo = await Promise.all(
          data.map(async (doctor) => {
            try {
              const userInfoResponse = await fetch(`http://localhost:5000/user/getUserInfo/${doctor.user}`);
              if (userInfoResponse.ok) {
                const userInfo = await userInfoResponse.json();
                return {
                  ...doctor,
                  fullName: userInfo.user.fullName,
                  gender: userInfo.user.gender,
                  avatar: userInfo.user.avatar?.url || "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
                };
              }
              return doctor;
            } catch (error) {
              console.error(`Error fetching user info for doctor ${doctor._id}:`, error);
              return doctor;
            }
          })
        );

        setDoctors(doctorsWithInfo);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const customStyles = `
    body {
      background: #1a1a1a;
      color: #e0e0e0;
    }

    .bg-dark-custom {
      background: #242424;
    }

    .doctor-card {
      transition: all 0.3s ease;
      border: none;
      background: #2a2a2a;
      box-shadow: 0 4px 6px rgba(0,0,0,0.2);
    }
    
    .doctor-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 12px rgba(0,0,0,0.3);
      background: #2d2d2d;
    }

    .rating-badge {
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

    .custom-header {
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      color: white;
      border-radius: 10px 10px 0 0;
    }

    .education-card {
      background: #2a2a2a;
      border-radius: 8px;
      border: 1px solid #404040;
      transition: all 0.2s ease;
    }

    .education-card:hover {
      background: #333333;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    .hours-card {
      background: #2a2a2a;
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 8px;
      border: 1px solid #404040;
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
      color: #6c757d;
    }

    .custom-search {
      padding-left: 45px !important;
      height: 50px;
      border-radius: 25px;
      background: #2a2a2a !important;
      border: 2px solid #404040 !important;
      color: #e0e0e0 !important;
    }

    .custom-search:focus {
      border-color: #2563eb !important;
      box-shadow: 0 0 0 0.2rem rgba(37,99,235,0.25) !important;
    }

    .custom-search::placeholder {
      color: #6c757d !important;
    }

    .dark-modal {
      background: #242424 !important;
      color: #e0e0e0;
    }

    .info-section {
      background: #2a2a2a;
      border: 1px solid #404040;
    }

    .btn-dark-custom {
      background: #2a2a2a;
      border: 1px solid #404040;
      color: #e0e0e0;
    }

    .btn-dark-custom:hover {
      background: #333333;
      color: #fff;
    }

    .text-dark-custom {
      color: #e0e0e0 !important;
    }

    .border-dark-custom {
      border-color: #404040 !important;
    }

    .gender-badge {
      background: rgba(59, 130, 246, 0.1);
      color: #60a5fa;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      margin-left: 8px;
    }
  `;

  const filteredDoctors = useMemo(() => {
    if (!searchTerm) return doctors;
    const searchTermLower = searchTerm.toLowerCase();
    return doctors.filter(
      (doctor) =>
        doctor.fullName?.toLowerCase().includes(searchTermLower) ||
        doctor.cnic?.toLowerCase().includes(searchTermLower)
    );
  }, [searchTerm, doctors]);

  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center" style={{ background: "#1a1a1a" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center" style={{ background: "#1a1a1a" }}>
        <div className="alert alert-danger" role="alert">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{ background: "#1a1a1a" }}>
      <style>{customStyles}</style>
      <AdminNavbar />

      <div className="container py-5">
        <div className="row mb-4">
          <div className="col-md-8">
            <h1 className="display-4 fw-bold text-primary mb-2">
              Doctor Management
            </h1>
            <p className="text-muted">
              Manage and monitor healthcare professionals
            </p>
          </div>
        </div>

        <div className="search-container">
          <i className="bi bi-search search-icon"></i>
          <input
            type="text"
            className="form-control custom-search"
            placeholder="Search doctors by name or CNIC..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="row g-4">
          {filteredDoctors.map((doctor) => (
            <div key={doctor._id} className="col-md-6 col-lg-4">
              <div
                className="card doctor-card h-100 cursor-pointer"
                onClick={() => setSelectedDoctor(doctor)}
              >
                <div className="position-relative">
                  <img
                    src={doctor.avatar}
                    alt={doctor.fullName}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="position-absolute top-0 end-0 m-3">
                    <span className="rating-badge">★ {doctor.rating}</span>
                  </div>
                </div>
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <h5 className="card-title text-primary mb-1">
                      {doctor.fullName || "Dr. Unknown"}
                    </h5>
                    <span className="gender-badge text-capitalize">
                      {doctor.gender || "N/A"}
                    </span>
                  </div>
                  <p className="text-muted mb-2">{doctor.specialization}</p>
                  <p className="card-text small text-dark-custom text-truncate">
                    {doctor.about}
                  </p>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <small className="text-muted">
                      {doctor.numPatients} patients
                    </small>
                    <small className="text-primary">
                      {doctor.reviewCount} reviews
                    </small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedDoctor && (
          <div className="modal show d-block custom-modal">
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content dark-modal border-dark-custom">
                <div className="custom-header p-4">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h4 className="mb-1">
                        {selectedDoctor.fullName || "Dr. Unknown"}
                        <span className="gender-badge text-capitalize">
                          {selectedDoctor.gender || "N/A"}
                        </span>
                      </h4>
                      <p className="mb-0 opacity-75">
                        {selectedDoctor.specialization}
                      </p>
                    </div>
                    <button
                      className="btn-close btn-close-white"
                      onClick={() => setSelectedDoctor(null)}
                    ></button>
                  </div>
                </div>

                <div className="modal-body p-4">
                  <div className="row">
                    <div className="col-md-4 mb-4 mb-md-0">
                      <img
                        src={selectedDoctor.avatar}
                        alt={selectedDoctor.fullName}
                        className="img-fluid rounded-3 mb-3"
                      />
                      <div className="info-section p-3 rounded-3">
                        <p className="mb-2">
                          <strong>Rating:</strong> ★ {selectedDoctor.rating}/5.0
                        </p>
                        <p className="mb-2">
                          <strong>Patients:</strong>{" "}
                          {selectedDoctor.numPatients}
                        </p>
                        <p className="mb-2">
                          <strong>CNIC:</strong> {selectedDoctor.cnic}
                        </p>
                        <p className="mb-0">
                          <strong>Address:</strong> {selectedDoctor.address}
                        </p>
                      </div>
                    </div>

                    <div className="col-md-8">
                      <h5 className="mb-3">About</h5>
                      <p className="mb-4 text-dark-custom">
                        {selectedDoctor.about}
                      </p>

                      <h5 className="mb-3">Education</h5>
                      {selectedDoctor.education?.map((edu, index) => (
                        <div key={index} className="education-card p-3 mb-3">
                          <h6 className="text-primary mb-1">{edu.degree}</h6>
                          <p className="mb-1 text-dark-custom">
                            {edu.institution}
                          </p>
                          <small className="text-muted">{edu.year}</small>
                        </div>
                      ))}

                      <h5 className="mb-3 mt-4">Office Hours</h5>
                      <div className="row">
                        {Object.entries(selectedDoctor.officeHours || {}).map(
                          ([day, hours]) => (
                            <div key={day} className="col-md-6">
                              <div className="hours-card">
                                <strong className="text-primary text-capitalize">
                                  {day}:
                                </strong>
                                <br />
                                <span className="text-dark-custom">
                                  {hours}
                                </span>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-dark-custom">
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => setDoctorToDelete(selectedDoctor)}
                  >
                    Delete Doctor
                  </button>
                  <button
                    className="btn btn-dark-custom"
                    onClick={() => setSelectedDoctor(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {doctorToDelete && (
          <div className="modal show d-block custom-modal">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content dark-modal border-dark-custom">
                <div className="modal-header border-dark-custom text-center">
                  <h5 className="modal-title w-100">Confirm Deletion</h5>
                </div>
                <div className="modal-body">
                  <div className="alert alert-danger bg-danger bg-opacity-10 text-danger border-danger">
                    <p className="mb-0 text-center">
                      Are you sure you want to delete Dr.{" "}
                      {doctorToDelete.fullName || "Unknown"}?
                      <br />
                      <small>This action cannot be undone.</small>
                    </p>
                  </div>
                </div>
                <div className="modal-footer border-dark-custom">
                  <button
                    className="btn btn-dark-custom"
                    onClick={() => setDoctorToDelete(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      console.log(
                        `Deleting doctor: ${doctorToDelete.fullName}`
                      );
                      setDoctorToDelete(null);
                      setSelectedDoctor(null);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {filteredDoctors.length === 0 && (
          <div className="alert bg-primary bg-opacity-10 text-primary border-primary text-center mt-4">
            No doctors found matching your search criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDoctors;