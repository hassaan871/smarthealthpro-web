import React, { useState, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AdminNavbar from "./AdminNavbar";

const AdminApproveDoctors = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorToDelete, setDoctorToDelete] = useState(null);
  const [doctorToApprove, setDoctorToApprove] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const doctors = [
    {
      _id: "1",
      fullName: "Dr. Alice Smith",
      specialization: "Hypertension",
      about:
        "Orthopedic surgeon with expertise in joint replacements and trauma surgery.",
      rating: 3.5,
      numPatients: 100,
      cnic: "34567-8901234-5",
      address: "789 Bone Street, Orthoville",
      avatar:
        "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png",
      officeHours: {
        monday: "08:00 AM - 06:00 PM",
        tuesday: "08:00 AM - 06:00 PM",
        wednesday: "Closed",
        thursday: "08:00 AM - 06:00 PM",
        friday: "08:00 AM - 06:00 PM",
        saturday: "09:00 AM - 01:00 PM",
        sunday: "Closed",
      },
      education: [
        {
          degree: "MBBS",
          institution: "Stanford University",
          year: "2004 - 2009",
        },
        {
          degree: "Fellowship in Orthopedics",
          institution: "Harvard Medical School",
          year: "2010 - 2012",
        },
      ],
      reviewCount: 100,
    },
    {
      _id: "2",
      fullName: "Dr. John Doe",
      specialization: "Cardiologist",
      about: "Experienced in handling heart-related conditions.",
      rating: 4.5,
      numPatients: 150,
      cnic: "12345-6789012-3",
      address: "123 Heart Street, Cardioville",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      officeHours: {
        monday: "09:00 AM - 05:00 PM",
        tuesday: "09:00 AM - 05:00 PM",
        wednesday: "Closed",
        thursday: "09:00 AM - 05:00 PM",
        friday: "09:00 AM - 03:00 PM",
        saturday: "Closed",
        sunday: "Closed",
      },
      education: [
        {
          degree: "MBBS",
          institution: "Oxford University",
          year: "2000 - 2005",
        },
        {
          degree: "MD in Cardiology",
          institution: "Cambridge University",
          year: "2006 - 2008",
        },
      ],
      reviewCount: 150,
    },
    {
      _id: "3",
      fullName: "Dr. Jane Smith",
      specialization: "Neurologist",
      about: "Specialist in treating neurological disorders.",
      rating: 4.8,
      numPatients: 200,
      cnic: "98765-4321098-7",
      address: "456 Neuro Lane, Brainville",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      officeHours: {
        monday: "10:00 AM - 06:00 PM",
        tuesday: "10:00 AM - 06:00 PM",
        wednesday: "10:00 AM - 02:00 PM",
        thursday: "10:00 AM - 06:00 PM",
        friday: "Closed",
        saturday: "10:00 AM - 01:00 PM",
        sunday: "Closed",
      },
      education: [
        {
          degree: "MBBS",
          institution: "Johns Hopkins University",
          year: "2002 - 2007",
        },
        { degree: "PhD in Neurology", institution: "MIT", year: "2008 - 2011" },
      ],
      reviewCount: 200,
    },
    {
      _id: "4",
      fullName: "Dr. Emily Brown",
      specialization: "Pediatrician",
      about: "Passionate about child health and wellness.",
      rating: 4.7,
      numPatients: 120,
      cnic: "45678-1234567-8",
      address: "321 Kid Street, Childville",
      avatar: "https://randomuser.me/api/portraits/women/4.jpg",
      officeHours: {
        monday: "08:00 AM - 04:00 PM",
        tuesday: "08:00 AM - 04:00 PM",
        wednesday: "Closed",
        thursday: "08:00 AM - 04:00 PM",
        friday: "08:00 AM - 03:00 PM",
        saturday: "09:00 AM - 12:00 PM",
        sunday: "Closed",
      },
      education: [
        { degree: "MBBS", institution: "UCLA", year: "2003 - 2008" },
        {
          degree: "MD in Pediatrics",
          institution: "Yale University",
          year: "2009 - 2011",
        },
      ],
      reviewCount: 120,
    },
    {
      _id: "5",
      fullName: "Dr. Michael Green",
      specialization: "Dermatologist",
      about: "Expert in skincare and dermatological treatments.",
      rating: 4.6,
      numPatients: 180,
      cnic: "67890-1234567-9",
      address: "789 Skin Street, Dermaville",
      avatar: "https://randomuser.me/api/portraits/men/5.jpg",
      officeHours: {
        monday: "09:00 AM - 05:00 PM",
        tuesday: "09:00 AM - 05:00 PM",
        wednesday: "09:00 AM - 01:00 PM",
        thursday: "09:00 AM - 05:00 PM",
        friday: "09:00 AM - 03:00 PM",
        saturday: "Closed",
        sunday: "Closed",
      },
      education: [
        {
          degree: "MBBS",
          institution: "University of Chicago",
          year: "2001 - 2006",
        },
        {
          degree: "MD in Dermatology",
          institution: "Columbia University",
          year: "2007 - 2009",
        },
      ],
      reviewCount: 180,
    },
    {
      _id: "6",
      fullName: "Dr. Sarah Johnson",
      specialization: "Endocrinologist",
      about: "Specialist in hormonal and metabolic disorders.",
      rating: 4.9,
      numPatients: 140,
      cnic: "12345-6789123-4",
      address: "123 Hormone Avenue, Metaboville",
      avatar: "https://randomuser.me/api/portraits/women/6.jpg",
      officeHours: {
        monday: "08:00 AM - 06:00 PM",
        tuesday: "08:00 AM - 06:00 PM",
        wednesday: "Closed",
        thursday: "08:00 AM - 06:00 PM",
        friday: "08:00 AM - 06:00 PM",
        saturday: "09:00 AM - 12:00 PM",
        sunday: "Closed",
      },
      education: [
        {
          degree: "MBBS",
          institution: "University of Michigan",
          year: "2003 - 2008",
        },
        {
          degree: "MD in Endocrinology",
          institution: "Harvard Medical School",
          year: "2009 - 2011",
        },
      ],
      reviewCount: 140,
    },
    {
      _id: "7",
      fullName: "Dr. William White",
      specialization: "Oncologist",
      about: "Expert in cancer diagnosis and treatment.",
      rating: 4.8,
      numPatients: 210,
      cnic: "54321-0987654-3",
      address: "456 Cancer Road, Oncoville",
      avatar: "https://randomuser.me/api/portraits/men/7.jpg",
      officeHours: {
        monday: "10:00 AM - 06:00 PM",
        tuesday: "10:00 AM - 06:00 PM",
        wednesday: "Closed",
        thursday: "10:00 AM - 06:00 PM",
        friday: "10:00 AM - 03:00 PM",
        saturday: "Closed",
        sunday: "Closed",
      },
      education: [
        { degree: "MBBS", institution: "Duke University", year: "2004 - 2009" },
        { degree: "MD in Oncology", institution: "UCSF", year: "2010 - 2013" },
      ],
      reviewCount: 210,
    },
    {
      _id: "8",
      fullName: "Dr. Olivia Blue",
      specialization: "Psychiatrist",
      about: "Providing compassionate mental health care.",
      rating: 4.5,
      numPatients: 110,
      cnic: "65432-1098765-2",
      address: "789 Mind Street, Psychoville",
      avatar: "https://randomuser.me/api/portraits/women/8.jpg",
      officeHours: {
        monday: "09:00 AM - 04:00 PM",
        tuesday: "09:00 AM - 04:00 PM",
        wednesday: "09:00 AM - 01:00 PM",
        thursday: "09:00 AM - 04:00 PM",
        friday: "09:00 AM - 03:00 PM",
        saturday: "Closed",
        sunday: "Closed",
      },
      education: [
        {
          degree: "MBBS",
          institution: "Brown University",
          year: "2005 - 2010",
        },
        {
          degree: "MD in Psychiatry",
          institution: "University of Pennsylvania",
          year: "2011 - 2013",
        },
      ],
      reviewCount: 110,
    },
    {
      _id: "9",
      fullName: "Dr. Henry Black",
      specialization: "Gastroenterologist",
      about: "Specialist in digestive health and treatments.",
      rating: 4.6,
      numPatients: 190,
      cnic: "76543-2109876-1",
      address: "456 Stomach Road, Digestoville",
      avatar: "https://randomuser.me/api/portraits/men/9.jpg",
      officeHours: {
        monday: "09:00 AM - 05:00 PM",
        tuesday: "09:00 AM - 05:00 PM",
        wednesday: "Closed",
        thursday: "09:00 AM - 05:00 PM",
        friday: "09:00 AM - 03:00 PM",
        saturday: "Closed",
        sunday: "Closed",
      },
      education: [
        {
          degree: "MBBS",
          institution: "University of Toronto",
          year: "2006 - 2011",
        },
        {
          degree: "MD in Gastroenterology",
          institution: "McGill University",
          year: "2012 - 2014",
        },
      ],
      reviewCount: 190,
    },
    {
      _id: "10",
      fullName: "Dr. Sophia Grey",
      specialization: "Rheumatologist",
      about: "Expert in arthritis and autoimmune diseases.",
      rating: 4.7,
      numPatients: 160,
      cnic: "87654-3210987-6",
      address: "123 Joint Street, Rheumaville",
      avatar: "https://randomuser.me/api/portraits/women/10.jpg",
      officeHours: {
        monday: "08:00 AM - 05:00 PM",
        tuesday: "08:00 AM - 05:00 PM",
        wednesday: "Closed",
        thursday: "08:00 AM - 05:00 PM",
        friday: "08:00 AM - 03:00 PM",
        saturday: "Closed",
        sunday: "Closed",
      },
      education: [
        {
          degree: "MBBS",
          institution: "University of Sydney",
          year: "2007 - 2012",
        },
        {
          degree: "MD in Rheumatology",
          institution: "University of Melbourne",
          year: "2013 - 2015",
        },
      ],
      reviewCount: 160,
    },
  ];

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
  `;

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

  const confirmApproveDoctor = () => {
    console.log(`Approving doctor: ${doctorToApprove.fullName}`);
    setDoctorToApprove(null);
  };

  const confirmDeleteDoctor = () => {
    console.log(`Declining doctor: ${doctorToDelete.fullName}`);
    setDoctorToDelete(null);
  };

  const filteredDoctors = useMemo(() => {
    if (!searchTerm) return doctors;
    const searchTermLower = searchTerm.toLowerCase();
    return doctors.filter(
      (doctor) =>
        doctor.fullName.toLowerCase().includes(searchTermLower) ||
        doctor.cnic.toLowerCase().includes(searchTermLower)
    );
  }, [searchTerm]);

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
              <div className="stats-number text-primary">10</div>
              <div className="text-light">Pending Approvals</div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="stats-card">
              <div className="stats-number text-success">25</div>
              <div className="text-light">Approved This Week</div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="stats-card">
              <div className="stats-number text-danger">5</div>
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
                          {selectedDoctor.reviewCount}
                        </p>
                        <p className="text-light mb-2">
                          <strong>Patients:</strong>{" "}
                          {selectedDoctor.numPatients}
                        </p>
                        <p className="text-light mb-2">
                          <strong>CNIC:</strong> {selectedDoctor.cnic}
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
                      Rating: {doctorToApprove.rating}/5.0
                    </p>
                    <p className="text-light mb-0">
                      Reviews: {doctorToApprove.reviewCount}
                    </p>
                  </div>
                  <div className="alert alert-success bg-success bg-opacity-10">
                    <p className="mb-0">
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
                  >
                    Confirm Approval
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
                      Rating: {doctorToDelete.rating}/5.0
                    </p>
                    <p className="text-light mb-0">
                      Reviews: {doctorToDelete.reviewCount}
                    </p>
                  </div>
                  <div className="alert alert-danger bg-danger bg-opacity-10">
                    <p className="mb-0">
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
                  >
                    Confirm Decline
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
