import React, { useState, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AdminNavbar from "./AdminNavbar";

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
      { degree: "MBBS", institution: "Oxford University", year: "2000 - 2005" },
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
      { degree: "MBBS", institution: "Brown University", year: "2005 - 2010" },
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

const AdminDoctors = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorToDelete, setDoctorToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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
  `;

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
            <p className="text-muted">
              Manage and monitor healthcare professionals
            </p>
          </div>
        </div>

        {/* Search Bar */}
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

        {/* Doctors Grid */}
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
                  <h5 className="card-title text-primary mb-1">
                    {doctor.fullName}
                  </h5>
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

        {/* Doctor Details Modal */}
        {selectedDoctor && (
          <div className="modal show d-block custom-modal">
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content dark-modal border-dark-custom">
                <div className="custom-header p-4">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h4 className="mb-1">{selectedDoctor.fullName}</h4>
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
                      {selectedDoctor.education.map((edu, index) => (
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
                        {Object.entries(selectedDoctor.officeHours).map(
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

        {/* Delete Confirmation Modal */}
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
                      {doctorToDelete.fullName}?
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
