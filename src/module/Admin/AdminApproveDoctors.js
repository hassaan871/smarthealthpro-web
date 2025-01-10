import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import AdminNavbar from "./AdminNavbar";
import { decrypt } from "../encrypt/Encrypt";

const AdminApproveDoctors = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorToDelete, setDoctorToDelete] = useState(null);
  const [doctorToApprove, setDoctorToApprove] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(25); // Initial value as per the example
  const [declinedCount, setDeclinedCount] = useState(5); // Initial value as per the example

  useEffect(() => {
    const fetchPendingDoctors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/user/admin/pendingDoctors"
        );
        setDoctors(response.data);
        setPendingCount(response.data.length);
      } catch (error) {
        console.error("Error fetching pending doctors:", error);
      }
    };

    fetchPendingDoctors();
  }, []);

  const handleDoctorDetails = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleApproveDoctor = (doctor) => {
    setDoctorToApprove(doctor);
    setSelectedDoctor(null);
  };

  const handleDeleteDoctor = (doctor) => {
    setDoctorToDelete(doctor);
    setSelectedDoctor(null);
  };

  const confirmApproveDoctor = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/user/admin/doctorApproval", {
        doctorId: doctorToApprove._id,
        action: "approve",
      });
      setDoctors(doctors.filter((doc) => doc._id !== doctorToApprove._id));
      setDoctorToApprove(null);
      setPendingCount(pendingCount - 1);
      setApprovedCount(approvedCount + 1);
    } catch (error) {
      console.error("Error approving doctor:", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteDoctor = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/user/admin/doctorApproval", {
        doctorId: doctorToDelete._id,
        action: "reject",
      });
      setDoctors(doctors.filter((doc) => doc._id !== doctorToDelete._id));
      setDoctorToDelete(null);
      setPendingCount(pendingCount - 1);
      setDeclinedCount(declinedCount + 1);
    } catch (error) {
      console.error("Error declining doctor:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = useMemo(() => {
    if (!searchTerm) return doctors;
    const searchTermLower = searchTerm.toLowerCase();
    return doctors.filter(
      (doctor) =>
        doctor.fullName.toLowerCase().includes(searchTermLower) ||
        doctor.cnic.toLowerCase().includes(searchTermLower)
    );
  }, [searchTerm, doctors]);

  const customStyles = `
    body {
      background: #1a1a1a;
    }

    .stats-number {
      font-size: 2.5rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }

    .stats-card {
      background: #2a2a2a;
      border: 1px solid #404040;
      border-radius: 8px;
      padding: 1.5rem;
    }

    .search-input {
      background: #2a2a2a;
      border: 1px solid #404040;
      color: white;
      padding: 0.75rem 1rem;
      border-radius: 6px;
      width: 100%;
    }

    .search-input:focus {
      border-color: #0d6efd;
      box-shadow: none;
      outline: none;
    }

    .search-input::placeholder {
      color: #6c757d;
    }

    .doctor-list-item {
      background: #2a2a2a;
      border: 1px solid #404040;
      border-radius: 8px;
      margin-bottom: 1rem;
      padding: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .doctor-list-item:hover {
      background: #323232;
      transform: translateY(-2px);
    }

    .doctor-info {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
    }

    .doctor-details {
      flex: 1;
    }

    .status-badge {
      background: #2b3038;
      color: #ffd700;
      border: 1px solid #ffd700;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.85rem;
    }

    .rating-text {
      color: #6c757d;
      font-size: 0.9rem;
      margin-top: 0.5rem;
    }

    .name-section {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      width: 100%;
      margin-bottom: 0.5rem;
    }

    .modal-dark {
      background: rgba(0, 0, 0, 0.85);
    }

    .modal-content-dark {
      background: #2a2a2a;
      border: 1px solid #404040;
    }

    .education-card {
      background: #323232;
      border: 1px solid #404040;
      border-radius: 6px;
      padding: 1rem;
      margin-bottom: 1rem;
    }

    .office-hours-table {
      background: #323232;
      border-radius: 6px;
      overflow: hidden;
    }

    .office-hours-table td {
      padding: 0.75rem;
      border-bottom: 1px solid #404040;
    }

    .office-hours-table tr:last-child td {
      border-bottom: none;
    }

    .table-dark {
      background: #2a2a2a;
      border-radius: 8px;
      border: 1px solid #404040;
    }

    .table-dark tr:last-child {
      border-bottom: none !important;
    }

    .alert-text {
      color: #f8d7da;
    }
  `;

  return (
    <div style={{ background: "#1a1a1a", minHeight: "100vh" }}>
      <style>{customStyles}</style>
      <AdminNavbar />

      <div className="container py-5">
        {/* Header */}
        <h1 className="text-primary mb-2">Doctor Approval Dashboard</h1>
        <p className="text-light mb-4">
          Review and approve doctor registration requests
        </p>

        {/* Stats Row */}
        <div className="row mb-4">
          <div className="col-md-4 mb-3">
            <div className="stats-card">
              <div className="stats-number text-primary">{pendingCount}</div>
              <div className="text-light">Pending Approvals</div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="stats-card">
              <div className="stats-number text-success">{approvedCount}</div>
              <div className="text-light">Approved This Week</div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="stats-card">
              <div className="stats-number text-danger">{declinedCount}</div>
              <div className="text-light">Declined This Week</div>
            </div>
          </div>
        </div>

        {/* Search Box */}
        <div className="mb-4">
          <input
            type="text"
            className="search-input"
            placeholder="Search by doctor name or CNIC..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Doctor List */}
        <div className="doctor-list">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor._id}
              className="doctor-list-item"
              onClick={() => handleDoctorDetails(doctor)}
            >
              <div className="doctor-info">
                <img
                  src={doctor.avatar}
                  alt={doctor.fullName}
                  className="rounded-circle"
                  style={{ width: "60px", height: "60px", objectFit: "cover" }}
                />
                <div className="doctor-details">
                  <div className="name-section">
                    <div>
                      <h5 className="text-light mb-0">{doctor.fullName}</h5>
                      <div className="text-primary">
                        {doctor.specialization}
                      </div>
                    </div>
                    <div className="d-flex flex-column align-items-end">
                      <span className="status-badge mb-2">
                        Pending Approval
                      </span>
                      <div className="rating-text">
                        Rating: {doctor.rating}/5.0 • {doctor.reviewCount}{" "}
                        reviews
                      </div>
                    </div>
                  </div>
                  <p className="text-secondary mb-0 mt-2">{doctor.about}</p>
                </div>
              </div>
            </div>
          ))}

          {filteredDoctors.length === 0 && (
            <div className="text-center py-4">
              <p className="text-light">
                No doctors found matching your search criteria
              </p>
            </div>
          )}
        </div>

        {/* Doctor Details Modal */}
        {selectedDoctor && (
          <div
            className="modal show d-block modal-dark"
            style={{ backdropFilter: "blur(5px)" }}
          >
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content modal-content-dark">
                <div className="modal-header border-secondary">
                  <h5 className="modal-title text-light">
                    {selectedDoctor.fullName}
                  </h5>
                  <button
                    className="btn-close btn-close-white"
                    onClick={() => setSelectedDoctor(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-4 text-center mb-4">
                      <img
                        src={selectedDoctor.avatar}
                        alt={selectedDoctor.fullName}
                        className="rounded-circle mb-3"
                        style={{
                          width: "150px",
                          height: "150px",
                          objectFit: "cover",
                        }}
                      />
                      <div className="status-badge d-inline-block">
                        Pending Approval
                      </div>
                    </div>
                    <div className="col-md-8">
                      <div className="mb-4">
                        <h6 className="text-primary mb-3">
                          Doctor Information
                        </h6>
                        <p className="text-light mb-2">
                          <strong>Specialization:</strong>{" "}
                          {selectedDoctor.specialization}
                        </p>
                        <p className="text-light mb-2">
                          <strong>Rating:</strong> {selectedDoctor.rating}/5.0
                        </p>
                        <p className="text-light mb-2">
                          <strong>Total Reviews:</strong>{" "}
                          {selectedDoctor.reviewCount > 0
                            ? selectedDoctor.reviewCount
                            : "0"}
                        </p>
                        <p className="text-light mb-2">
                          <strong>Patients:</strong>{" "}
                          {selectedDoctor.numPatients}
                        </p>
                        <p className="text-light mb-2">
                          <strong>CNIC:</strong> {decrypt(selectedDoctor.cnic)}
                        </p>
                        <p className="text-light mb-2">
                          <strong>Address:</strong> {selectedDoctor.address}
                        </p>
                        <p className="text-light mb-0">
                          <strong>About:</strong> {selectedDoctor.about}
                        </p>
                      </div>

                      <h6 className="text-primary mb-3">Education</h6>
                      {selectedDoctor.education.map((edu, index) => (
                        <div key={index} className="education-card">
                          <h6 className="text-light mb-1">{edu.degree}</h6>
                          <p className="text-primary mb-1">{edu.institution}</p>
                          <small className="text-secondary">{edu.year}</small>
                        </div>
                      ))}

                      <h6 className="text-primary mb-3 mt-4">Office Hours</h6>
                      <div className="table-responsive">
                        <table className="table table-dark mb-0 rounded overflow-hidden">
                          <tbody>
                            {Object.entries(selectedDoctor.officeHours).map(
                              ([day, hours]) => (
                                <tr
                                  key={day}
                                  className="border-bottom border-secondary"
                                >
                                  <td
                                    className="text-capitalize text-light ps-3"
                                    style={{ background: "#2a2a2a" }}
                                  >
                                    {day}
                                  </td>
                                  <td
                                    className="text-end text-light pe-3"
                                    style={{ background: "#2a2a2a" }}
                                  >
                                    {hours}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-secondary">
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteDoctor(selectedDoctor)}
                  >
                    Decline
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={() => handleApproveDoctor(selectedDoctor)}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setSelectedDoctor(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Approve Confirmation Modal */}
        {doctorToApprove && (
          <div
            className="modal show d-block modal-dark"
            style={{ backdropFilter: "blur(5px)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content modal-content-dark">
                <div className="modal-header border-secondary">
                  <h5 className="modal-title text-light">Confirm Approval</h5>
                  <button
                    className="btn-close btn-close-white"
                    onClick={() => setDoctorToApprove(null)}
                  ></button>
                </div>
                <div className="modal-body text-center">
                  <img
                    src={doctorToApprove.avatar}
                    alt={doctorToApprove.fullName}
                    className="rounded-circle mb-3"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                  <h5 className="text-light mb-3">
                    {doctorToApprove.fullName}
                  </h5>
                  <div className="education-card mb-4">
                    <p className="text-light mb-1">
                      Specialization: {doctorToApprove.specialization}
                    </p>
                    <p className="text-light mb-1">
                      Rating:{" "}
                      {doctorToApprove.rating > 0
                        ? doctorToApprove.rating
                        : "0"}
                      /5.0
                    </p>
                    <p className="text-light mb-0">
                      Reviews:{" "}
                      {doctorToApprove.reviewCount > 0
                        ? doctorToApprove.reviewCount
                        : "0"}
                    </p>
                  </div>
                  <div className="alert alert-success bg-success bg-opacity-10">
                    <p className="mb-0 alert-text">
                      Are you sure you want to approve this doctor? They will be
                      granted access to the platform.
                    </p>
                  </div>
                </div>
                <div className="modal-footer border-secondary">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setDoctorToApprove(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={confirmApproveDoctor}
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Confirm Approval"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {doctorToDelete && (
          <div
            className="modal show d-block modal-dark"
            style={{ backdropFilter: "blur(5px)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content modal-content-dark">
                <div className="modal-header border-secondary">
                  <h5 className="modal-title text-light">Confirm Decline</h5>
                  <button
                    className="btn-close btn-close-white"
                    onClick={() => setDoctorToDelete(null)}
                  ></button>
                </div>
                <div className="modal-body text-center">
                  <img
                    src={doctorToDelete.avatar}
                    alt={doctorToDelete.fullName}
                    className="rounded-circle mb-3"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                  <h5 className="text-light mb-3">{doctorToDelete.fullName}</h5>
                  <div className="education-card mb-4">
                    <p className="text-light mb-1">
                      Specialization: {doctorToDelete.specialization}
                    </p>
                    <p className="text-light mb-1">
                      Rating:{" "}
                      {doctorToDelete.rating > 0 ? doctorToDelete.rating : "0"}
                      /5.0
                    </p>
                    <p className="text-light mb-0">
                      Reviews:{" "}
                      {doctorToDelete.reviewCount > 0
                        ? doctorToDelete.reviewCount
                        : "0"}
                    </p>
                  </div>
                  <div className="alert alert-danger bg-danger bg-opacity-10">
                    <p className="mb-0 alert-text">
                      Are you sure you want to decline this doctor's approval
                      request? This action cannot be undone.
                    </p>
                  </div>
                </div>
                <div className="modal-footer border-secondary">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setDoctorToDelete(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={confirmDeleteDoctor}
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Confirm Decline"}
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

// Convert date to readable format
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default AdminApproveDoctors;
