import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState({
    specialization: "",
    cnic: "",
    email: "",
    address: "",
    about: "",
    officeHours: {
      monday: { status: "closed" },
      tuesday: { status: "closed" },
      wednesday: { status: "closed" },
      thursday: { status: "closed" },
      friday: { status: "closed" },
      saturday: { status: "closed" },
      sunday: { status: "closed" },
    },
    education: [],
    user: {
      fullName: "",
      email: "",
      avatar: "",
    },
    profileImage:
      "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  useEffect(() => {
    const fetchDoctorData = async () => {
      const userString = localStorage.getItem("userToken");
      const userId = userString;

      try {
        const userResponse = await axios.get(`http://localhost:5000/user/getUserInfo/${userId}`);
        const userData = userResponse.data.user;

        const doctorsResponse = await axios.get("http://localhost:5000/user/getAllDoctors");
        const doctorsData = doctorsResponse.data;

        const doctorData = doctorsData.find((doctor) => doctor.user === userId);
        const doctorId = doctorData ? doctorData._id : null;

        if (doctorId) {
          const doctorResponse = await axios.get(`http://localhost:5000/user/getDoctorById/${doctorId}`);
          const doctorDetails = doctorResponse.data;
          setDoctor((prevDoctor) => ({
            ...prevDoctor,
            ...doctorDetails,
            email: doctorDetails.user.email, 
          }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDoctorData();
  }, []);

  const validateField = (name, value) => {
    switch (name) {
      case "fullName":
        return value.length < 3 ? "Full name must be at least 3 characters long" : "";
        case "email":
          console.log("sd", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          console.log("v",value)
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Email address is invalid";
      case "cnic":
        return !/^\d{5}-\d{7}-\d$/.test(value) ? "CNIC must be in the format xxxxx-xxxxxxx-x" : "";
      default:
        return "";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email' || name === 'fullName') {
      setDoctor(prev => ({
        ...prev,
        user: { ...prev.user, [name]: value }
      }));
    } else {
      setDoctor(prev => ({ ...prev, [name]: value }));
    }
  
    const error = validateField(name, value);
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: error
    }));
  };

  const handleOfficeHoursChange = (day, type, value) => {
    setDoctor((prevDoctor) => ({
      ...prevDoctor,
      officeHours: {
        ...prevDoctor.officeHours,
        [day]: {
          ...prevDoctor.officeHours[day],
          [type]: value,
          status: type === "status" ? value : prevDoctor.officeHours[day].status,
        },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(doctor).forEach((key) => {
      if (typeof doctor[key] === "string") {
        const error = validateField(key, doctor[key]);
        if (error) newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        const userId = localStorage.getItem("userToken");
        const updateData = {
          specialization: doctor.specialization,
          cnic: doctor.cnic,
          address: doctor.address,
          about: doctor.about,
          officeHours: doctor.officeHours,
          education: doctor.education,
        };

        const userUpdateData = {
          fullName: doctor.user.fullName,
          email: doctor.user.email,
          role:"doctor"
        };

        console.log("user upd dete ",userUpdateData)

        const doctorResponse = await axios.put(`http://localhost:5000/user/updateDoctorInfo/${userId}`, updateData);
        const userResponse = await axios.put(`http://localhost:5000/user/updateUser/${userId}`, userUpdateData);

        setUpdateMessage("Profile updated successfully!");
        console.log("Doctor update response:", doctorResponse.data);
        console.log("User update response:", userResponse.data);
      } catch (error) {
        console.error("Error updating profile:", error);
        setUpdateMessage("Failed to update profile. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrors(newErrors);
    }

  };

  return (
    <div className="container-fluid" style={{ marginTop: "75px", width: "90vw" }}>
      <div className="row">
        <div className="col-md-6">
          <div className="card mt-4">
            <img
              src={doctor.user?.avatar?.url?.length > 0 ? doctor.user.avatar.url : doctor.user.avatar}
              alt={doctor.user.fullName}
              className="card-img-top rounded-circle mx-auto mt-3"
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />
            <div className="card-body text-center">
              <h2 className="card-title">{doctor.user.fullName}</h2>
              <p className="card-text text-muted">{doctor.specialization}</p>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <strong>Email:</strong> {doctor.user.email || "Not provided"}
              </li>
              <li className="list-group-item">
                <strong>CNIC:</strong> {doctor.cnic}
              </li>
              <li className="list-group-item">
                <strong>Address:</strong> {doctor.address}
              </li>
            </ul>
          </div>
          <div className="card mt-4">
            <div className="card-body">
              <h5 className="card-title">About</h5>
              <p className="card-text">{doctor.about}</p>
            </div>
          </div>
          <div className="card mt-4">
            <div className="card-body">
              <h5 className="card-title">Education</h5>
              <ul className="list-unstyled">
                {doctor.education &&
                  doctor.education.map((edu, index) => (
                    <li key={index} className="mb-2">
                      <strong>{edu.degree}</strong>
                      <br />
                      {edu.institution} ({edu.year})
                    </li>
                  ))}
              </ul>
            </div>
          </div>
          <div className="card mt-4">
            <div className="card-body">
              <h5 className="card-title">Clinic Hours</h5>
              <ul className="list-unstyled">
                {doctor.officeHours &&
                  Object.entries(doctor.officeHours).map(([day, hours]) => (
                    <li key={day} className="mb-2">
                      <strong>{day.charAt(0).toUpperCase() + day.slice(1)}:</strong>{" "}
                      {hours.status === "closed" ? "Closed" : `${hours.open} - ${hours.close}`}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <h2 className="mb-4 mt-4">Edit Profile</h2>
          <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="fullName" className="form-label">Full Name</label>
            <input
              type="text"
              className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
              id="fullName"
              name="fullName"
              value={doctor.user.fullName}
              onChange={handleInputChange}
              required
            />
            {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
          </div>
            <div className="mb-3">
              <label htmlFor="specialization" className="form-label">Specialization</label>
              <input
                type="text"
                className="form-control"
                id="specialization"
                name="specialization"
                value={doctor.specialization}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="profileImage" className="form-label">
                Profile Picture
              </label>
              <input
                type="file"
                className="form-control"
                id="profileImage"
                // onChange={handleImageChange}
                accept="image/*"
              />
            </div>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  id="email"
                  name="email"
                  value={doctor.user.email}
                  onChange={handleInputChange}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>
            <div className="mb-3">
              <label htmlFor="cnic" className="form-label">CNIC</label>
              <input
                type="text"
                className={`form-control ${errors.cnic ? "is-invalid" : ""}`}
                id="cnic"
                name="cnic"
                value={doctor.cnic}
                onChange={handleInputChange}
                required
              />
              {errors.cnic && <div className="invalid-feedback">{errors.cnic}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="address" className="form-label">Address</label>
              <textarea
                className="form-control"
                id="address"
                name="address"
                value={doctor.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="about" className="form-label">About</label>
              <textarea
                className="form-control"
                id="about"
                name="about"
                value={doctor.about}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Clinic Hours</label>
              {doctor.officeHours &&
                Object.entries(doctor.officeHours).map(([day, hours]) => (
                  <div key={day} className="mb-2">
                    <div className="row align-items-center">
                      <div className="col-md-3">
                        <label className="form-label">
                          {day.charAt(0).toUpperCase() + day.slice(1)}:
                        </label>
                      </div>
                      <div className="col-md-3">
                        <select
                          value={hours.status}
                          onChange={(e) => handleOfficeHoursChange(day, "status", e.target.value)}
                          className="form-select"
                        >
                          <option value="open">Open</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                      {hours.status === "open" && (
                        <>
                          <div className="col-md-3">
                            <input
                              type="time"
                              value={hours.open}
                              onChange={(e) => handleOfficeHoursChange(day, "open", e.target.value)}
                              className="form-control"
                            />
                          </div>
                          <div className="col-md-3">
                            <input
                              type="time"
                              value={hours.close}
                              onChange={(e) => handleOfficeHoursChange(day, "close", e.target.value)}
                              className="form-control"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Save Changes"}
            </button>
          </form>
          {updateMessage && (
            <div className={`alert ${updateMessage.includes("Failed") ? "alert-danger" : "alert-success"} mt-3`}>
              {updateMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;