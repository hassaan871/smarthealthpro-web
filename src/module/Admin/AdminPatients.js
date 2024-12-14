import React, { useState, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const patients = [
        {
          "userName": "martin_white",
          "fullName": "Martin White",
          "email": "martin.white@example.com",
          "password": "$2b$10$5A/HiRdjC3gAG0D28uAlluDcnT4jpUQyy8sEfxZ71T7nOz/YfPTD.",
          "role": "patient",
          "avatar": "https://randomuser.me/api/portraits/men/3.jpg",
          "gender": "male",
          "dateOfBirth": "1990-01-01T00:00:00.000Z",
          "bloodType": "O+"
        },
        {
          "userName": "jane_doe",
          "fullName": "Jane Doe",
          "email": "jane.doe@example.com",
          "password": "$2b$10$5A/HiRdjC3gAG0D28uAlluDcnT4jpUQyy8sEfxZ71T7nOz/YfPTD.",
          "role": "patient",
          "avatar": "https://randomuser.me/api/portraits/women/5.jpg",
          "gender": "female",
          "dateOfBirth": "1995-03-15T00:00:00.000Z",
          "bloodType": "A+"
        },
        {
          "userName": "alex_brown",
          "fullName": "Alex Brown",
          "email": "alex.brown@example.com",
          "password": "$2b$10$5A/HiRdjC3gAG0D28uAlluDcnT4jpUQyy8sEfxZ71T7nOz/YfPTD.",
          "role": "patient",
          "avatar": "https://randomuser.me/api/portraits/men/10.jpg",
          "gender": "male",
          "dateOfBirth": "1988-07-20T00:00:00.000Z",
          "bloodType": "B-"
        },
        {
          "userName": "sophia_smith",
          "fullName": "Sophia Smith",
          "email": "sophia.smith@example.com",
          "password": "$2b$10$5A/HiRdjC3gAG0D28uAlluDcnT4jpUQyy8sEfxZ71T7nOz/YfPTD.",
          "role": "patient",
          "avatar": "https://randomuser.me/api/portraits/women/12.jpg",
          "gender": "female",
          "dateOfBirth": "2000-11-05T00:00:00.000Z",
          "bloodType": "O-"
        },
        {
          "userName": "john_davis",
          "fullName": "John Davis",
          "email": "john.davis@example.com",
          "password": "$2b$10$5A/HiRdjC3gAG0D28uAlluDcnT4jpUQyy8sEfxZ71T7nOz/YfPTD.",
          "role": "patient",
          "avatar": "https://randomuser.me/api/portraits/men/18.jpg",
          "gender": "male",
          "dateOfBirth": "1992-06-10T00:00:00.000Z",
          "bloodType": "AB+"
        },
        {
          "userName": "emily_clark",
          "fullName": "Emily Clark",
          "email": "emily.clark@example.com",
          "password": "$2b$10$5A/HiRdjC3gAG0D28uAlluDcnT4jpUQyy8sEfxZ71T7nOz/YfPTD.",
          "role": "patient",
          "avatar": "https://randomuser.me/api/portraits/women/25.jpg",
          "gender": "female",
          "dateOfBirth": "1985-12-23T00:00:00.000Z",
          "bloodType": "A-"
        },
        {
          "userName": "daniel_jones",
          "fullName": "Daniel Jones",
          "email": "daniel.jones@example.com",
          "password": "$2b$10$5A/HiRdjC3gAG0D28uAlluDcnT4jpUQyy8sEfxZ71T7nOz/YfPTD.",
          "role": "patient",
          "avatar": "https://randomuser.me/api/portraits/men/28.jpg",
          "gender": "male",
          "dateOfBirth": "1983-09-01T00:00:00.000Z",
          "bloodType": "B+"
        },
        {
          "userName": "olivia_lee",
          "fullName": "Olivia Lee",
          "email": "olivia.lee@example.com",
          "password": "$2b$10$5A/HiRdjC3gAG0D28uAlluDcnT4jpUQyy8sEfxZ71T7nOz/YfPTD.",
          "role": "patient",
          "avatar": "https://randomuser.me/api/portraits/women/34.jpg",
          "gender": "female",
          "dateOfBirth": "1997-04-18T00:00:00.000Z",
          "bloodType": "O+"
        },
        {
          "userName": "liam_martin",
          "fullName": "Liam Martin",
          "email": "liam.martin@example.com",
          "password": "$2b$10$5A/HiRdjC3gAG0D28uAlluDcnT4jpUQyy8sEfxZ71T7nOz/YfPTD.",
          "role": "patient",
          "avatar": "https://randomuser.me/api/portraits/men/40.jpg",
          "gender": "male",
          "dateOfBirth": "1987-02-14T00:00:00.000Z",
          "bloodType": "AB-"
        },
        {
          "userName": "amelia_turner",
          "fullName": "Amelia Turner",
          "email": "amelia.turner@example.com",
          "password": "$2b$10$5A/HiRdjC3gAG0D28uAlluDcnT4jpUQyy8sEfxZ71T7nOz/YfPTD.",
          "role": "patient",
          "avatar": "https://randomuser.me/api/portraits/women/45.jpg",
          "gender": "female",
          "dateOfBirth": "1993-08-25T00:00:00.000Z",
          "bloodType": "B+"
        }
      ]
      
      const AdminPatients = () => {
        const [selectedPatient, setSelectedPatient] = useState(null);
        const [patientToDelete, setPatientToDelete] = useState(null);
        const [searchTerm, setSearchTerm] = useState("");
      
        const handlePatientDetails = (patient) => {
          setSelectedPatient(patient);
        };
      
        const closeDetails = () => {
          setSelectedPatient(null);
        };
      
        const handleDeletePatient = (patient) => {
          setPatientToDelete(patient);
        };
      
        const confirmDeletePatient = () => {
          console.log(`Deleting patient: ${patientToDelete.fullName}`);
          setPatientToDelete(null);
          setSelectedPatient(null);
        };
      
        const cancelDelete = () => {
          setPatientToDelete(null);
        };
      
        const formatDate = (dateString) => {
          return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        };
      
        // Filter patients based on search term
        const filteredPatients = useMemo(() => {
          if (!searchTerm) return patients;
      
          const searchTermLower = searchTerm.toLowerCase();
          return patients.filter(patient => 
            patient.fullName.toLowerCase().includes(searchTermLower) ||
            patient.email.toLowerCase().includes(searchTermLower) ||
            patient.userName.toLowerCase().includes(searchTermLower)
          );
        }, [searchTerm]);
      
        return (
          <div className="container-fluid bg-dark text-white py-5" style={{ minHeight: "100vh" }}>
            <div className="container">
              <h1 className="text-center mb-5 text-primary">Patient Management</h1>
              
              {/* Search Bar */}
              <div className="row mb-4">
                <div className="col-md-8 offset-md-2">
                  <div className="input-group">
                    <input 
                      type="text" 
                      className="form-control bg-secondary text-white" 
                      placeholder="Search by Name, Username, or Email" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="input-group-text bg-primary text-white">
                      <i className="bi bi-search"></i>
                    </span>
                  </div>
                </div>
              </div>
      
              <div className="row">
                <div className="col-md-8 offset-md-2">
                  <div className="card bg-secondary">
                    <div className="card-header bg-dark">
                      <h5 className="text-primary mb-0">Registered Patients</h5>
                    </div>
                    <div className="card-body">
                      <div className="list-group">
                        {filteredPatients.map((patient) => (
                          <div 
                            key={patient.userName} 
                            className="list-group-item list-group-item-action bg-dark text-white mb-2 rounded"
                            onClick={() => handlePatientDetails(patient)}
                            style={{ cursor: "pointer" }}
                          >
                            <div className="d-flex w-100 justify-content-between align-items-center">
                              <div className="d-flex align-items-center">
                                <img 
                                  src={patient.avatar} 
                                  alt={patient.fullName} 
                                  className="rounded-circle me-3"
                                  style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                />
                                <div>
                                  <h5 className="mb-1 text-primary">{patient.fullName}</h5>
                                  <small className="text-muted">@{patient.userName}</small>
                                </div>
                              </div>
                              <span className="badge bg-primary">{patient.bloodType}</span>
                            </div>
                          </div>
                        ))}
                        
                        {filteredPatients.length === 0 && (
                          <div className="text-center text-muted py-3">
                            No patients found matching your search
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
      
              {/* Patient Details Modal */}
              {selectedPatient && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.7)", position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1050, overflowY: "auto" }}>
                  <div className="modal-dialog modal-lg">
                    <div className="modal-content bg-dark text-white">
                      <div className="modal-header border-bottom-0">
                        <h5 className="modal-title text-primary">{selectedPatient.fullName}</h5>
                        <button 
                          type="button" 
                          className="btn-close btn-close-white" 
                          onClick={closeDetails}
                        ></button>
                      </div>
                      <div className="modal-body">
                        <div className="row">
                          <div className="col-md-4 text-center">
                            <img 
                              src={selectedPatient.avatar} 
                              alt={selectedPatient.fullName} 
                              className="img-fluid rounded-circle mb-3"
                              style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "cover" }}
                            />
                            <h5 className="text-primary mb-2">@{selectedPatient.userName}</h5>
                            <span className="badge bg-primary">{selectedPatient.bloodType}</span>
                          </div>
                          <div className="col-md-8">
                            <h4 className="text-primary mb-3">Patient Information</h4>
                            <div className="card bg-secondary mb-3">
                              <div className="card-body">
                                <p><strong className="text-primary">Email:</strong> {selectedPatient.email}</p>
                                <p><strong className="text-primary">Gender:</strong> {selectedPatient.gender.charAt(0).toUpperCase() + selectedPatient.gender.slice(1)}</p>
                                <p><strong className="text-primary">Date of Birth:</strong> {formatDate(selectedPatient.dateOfBirth)}</p>
                                <p><strong className="text-primary">Blood Type:</strong> {selectedPatient.bloodType}</p>
                                <p><strong className="text-primary">Role:</strong> {selectedPatient.role.charAt(0).toUpperCase() + selectedPatient.role.slice(1)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer border-top-0">
                        <button 
                          type="button" 
                          className="btn btn-danger me-2" 
                          onClick={() => handleDeletePatient(selectedPatient)}
                        >
                          Delete Patient
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-outline-light" 
                          onClick={closeDetails}
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
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.7)", position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1051, overflowY: "auto" }}>
                  <div className="modal-dialog">
                    <div className="modal-content bg-dark text-white">
                      <div className="modal-header border-bottom-0">
                        <h5 className="modal-title text-danger">Confirm Patient Deletion</h5>
                        <button 
                          type="button" 
                          className="btn-close btn-close-white" 
                          onClick={cancelDelete}
                        ></button>
                      </div>
                      <div className="modal-body">
                        <p>Are you sure you want to delete the following patient permanently?</p>
                        <div className="alert alert-danger">
                          <strong>Name:</strong> {patientToDelete.fullName}<br />
                          <strong>Username:</strong> @{patientToDelete.userName}<br />
                          <strong>Email:</strong> {patientToDelete.email}
                        </div>
                        <p className="text-warning">This action cannot be undone.</p>
                      </div>
                      <div className="modal-footer border-top-0">
                        <button 
                          type="button" 
                          className="btn btn-outline-light" 
                          onClick={cancelDelete}
                        >
                          Cancel
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-danger" 
                          onClick={confirmDeletePatient}
                        >
                          Confirm Delete
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