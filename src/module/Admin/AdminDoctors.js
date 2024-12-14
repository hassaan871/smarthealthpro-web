import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const doctors = [
  {
    _id: "1",
    fullName: "Dr. Alice Smith",
    specialization: "Hypertension",
    about: "Orthopedic surgeon with expertise in joint replacements and trauma surgery.",
    rating: 3.5,
    numPatients: 100,
    cnic: "34567-8901234-5",
    address: "789 Bone Street, Orthoville",
    avatar: "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png",
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
      { degree: "MBBS", institution: "Stanford University", year: "2004 - 2009" },
      { degree: "Fellowship in Orthopedics", institution: "Harvard Medical School", year: "2010 - 2012" },
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
      { degree: "MD in Cardiology", institution: "Cambridge University", year: "2006 - 2008" },
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
      { degree: "MBBS", institution: "Johns Hopkins University", year: "2002 - 2007" },
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
      { degree: "MD in Pediatrics", institution: "Yale University", year: "2009 - 2011" },
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
      { degree: "MBBS", institution: "University of Chicago", year: "2001 - 2006" },
      { degree: "MD in Dermatology", institution: "Columbia University", year: "2007 - 2009" },
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
      { degree: "MBBS", institution: "University of Michigan", year: "2003 - 2008" },
      { degree: "MD in Endocrinology", institution: "Harvard Medical School", year: "2009 - 2011" },
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
      { degree: "MD in Psychiatry", institution: "University of Pennsylvania", year: "2011 - 2013" },
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
      { degree: "MBBS", institution: "University of Toronto", year: "2006 - 2011" },
      { degree: "MD in Gastroenterology", institution: "McGill University", year: "2012 - 2014" },
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
      { degree: "MBBS", institution: "University of Sydney", year: "2007 - 2012" },
      { degree: "MD in Rheumatology", institution: "University of Melbourne", year: "2013 - 2015" },
    ],
    reviewCount: 160,
  },
];

// console.log(doctors);


const AdminDoctors = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const handleDoctorDetails = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const closeDetails = () => {
    setSelectedDoctor(null);
  };

  return (
    <div className="container-fluid bg-dark text-white py-5" style={{ minHeight: "100vh" }}>
      <div className="container">
        <h1 className="text-center mb-5 text-info">Doctor Management</h1>
        
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <div className="card bg-secondary">
              <div className="card-header bg-dark text-info">
                <h3 className="mb-0">Registered Doctors</h3>
              </div>
              <div className="card-body">
                <div className="list-group">
                  {doctors.map((doctor) => (
                    <div 
                      key={doctor._id} 
                      className="list-group-item list-group-item-action bg-dark text-white mb-2 rounded"
                      onClick={() => handleDoctorDetails(doctor)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1 text-info">{doctor.fullName}</h5>
                        <small className="text-muted">{doctor.specialization}</small>
                      </div>
                      <p className="mb-1">{doctor.about}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Doctor Details Modal */}
        {selectedDoctor && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.7)", position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1050, overflowY: "auto" }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content bg-secondary text-white">
                <div className="modal-header border-bottom-0">
                  <h5 className="modal-title text-info">{selectedDoctor.fullName}</h5>
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
                        src={selectedDoctor.avatar} 
                        alt={selectedDoctor.fullName} 
                        className="img-fluid rounded-circle mb-3"
                        style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "cover" }}
                      />
                    </div>
                    <div className="col-md-8">
                      <h4 className="text-info mb-3">Doctor Details</h4>
                      <p><strong className="text-info">Specialization:</strong> {selectedDoctor.specialization}</p>
                      <p><strong className="text-info">About:</strong> {selectedDoctor.about}</p>
                      <p><strong className="text-info">CNIC:</strong> {selectedDoctor.cnic}</p>
                      <p><strong className="text-info">Address:</strong> {selectedDoctor.address}</p>
                      <p><strong className="text-info">Rating:</strong> {selectedDoctor.rating}/5.0</p>
                      <p><strong className="text-info">Number of Patients:</strong> {selectedDoctor.numPatients}</p>
                      <p><strong className="text-info">Review Count:</strong> {selectedDoctor.reviewCount}</p>
                    </div>
                  </div>

                  {/* Education Section */}
                  <div className="row mt-4">
                    <div className="col-12">
                      <h4 className="text-info mb-3">Education</h4>
                      <ul className="list-group">
                        {selectedDoctor.education.map((edu, index) => (
                          <li 
                            key={index} 
                            className="list-group-item bg-dark text-white"
                          >
                            <strong className="text-info">{edu.degree}</strong> from {edu.institution}
                            <br />
                            <small className="text-muted">({edu.year})</small>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Office Hours Section */}
                  <div className="row mt-4">
                    <div className="col-12">
                      <h4 className="text-info mb-3">Office Hours</h4>
                      <div className="table-responsive">
                        <table className="table table-dark table-striped">
                          <tbody>
                            {Object.entries(selectedDoctor.officeHours).map(([day, hours]) => (
                              <tr key={day}>
                                <td className="text-capitalize">{day}</td>
                                <td>{hours}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top-0">
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
      </div>
    </div>
  );
};

export default AdminDoctors;