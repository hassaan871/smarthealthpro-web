import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faAddressCard,
  faClock,
  faGraduationCap,
  faUpload,
  faUserDoctor,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axiosInstance";

const UserProfileCompletion = () => {
  const [user, setUser] = useState({
    fullName: "",
    specialization: "",
    cnic: "",
    address: "",
    about: "",
    clinicHours: {
      monday: { open: "", close: "" },
      tuesday: { open: "", close: "" },
      wednesday: { open: "", close: "" },
      thursday: { open: "", close: "" },
      friday: { open: "", close: "" },
      saturday: { open: "", close: "" },
      sunday: { open: "", close: "" },
    },
    education: [{ degree: "", institution: "", startYear: "", endYear: "" }],
    degreeFiles: [],
    profileImage: null,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const signupData = JSON.parse(localStorage.getItem("signupData"));
    if (signupData) {
      setUser((prevUser) => ({
        ...prevUser,
        name: signupData.name,
        email: signupData.email,
        gender: signupData.gender,
      }));
    }
  }, []);

  const registerUser = async (userData) => {
    try {
      const response = await api.post("/user/register", {
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data = await response.json();
      console.log("Registration successful:", data);
      localStorage.removeItem("signupData");
      navigate("/doctordashboard");
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const signupData = JSON.parse(localStorage.getItem("signupData"));

    const officeHours = {};
    Object.entries(user.clinicHours).forEach(([day, hours]) => {
      if (hours.open && hours.close) {
        officeHours[day] = `${hours.open} - ${hours.close}`;
      } else {
        officeHours[day] = "Closed";
      }
    });

    const userData = {
      userName: `dr.${user.fullName.toLowerCase().replace(/\s/g, "")}`,
      fullName: user.fullName,
      email: signupData.email,
      password: signupData.password,
      avatar:
        previewImage ||
        "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png",
      specialization: user.specialization,
      cnic: user.cnic,
      address: user.address,
      rating: 0,
      reviewCount: 0,
      numPatients: 0,
      about: user.about,
      officeHours: officeHours,
      education: user.education.map((edu) => ({
        degree: edu.degree,
        institution: edu.institution,
        year: edu.startYear,
      })),
      gender: signupData.gender,
    };

    registerUser(userData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleClinicHoursChange = (day, type, value) => {
    setUser((prevUser) => ({
      ...prevUser,
      clinicHours: {
        ...prevUser.clinicHours,
        [day]: { ...prevUser.clinicHours[day], [type]: value },
      },
    }));
  };

  const handleEducationChange = (index, field, value) => {
    setUser((prevUser) => {
      const updatedEducation = [...prevUser.education];
      updatedEducation[index] = { ...updatedEducation[index], [field]: value };
      return { ...prevUser, education: updatedEducation };
    });
  };

  const addEducationField = () => {
    setUser((prevUser) => ({
      ...prevUser,
      education: [
        ...prevUser.education,
        { degree: "", institution: "", startYear: "", endYear: "" },
      ],
    }));
  };

  const removeEducationField = (index) => {
    setUser((prevUser) => ({
      ...prevUser,
      education: prevUser.education.filter((_, i) => i !== index),
    }));
  };

  const handleFileChange = (e) => {
    setUser((prevUser) => ({
      ...prevUser,
      degreeFiles: Array.from(e.target.files),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setUser((prevUser) => ({ ...prevUser, profileImage: file }));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= currentYear - 50; year--) {
      years.push(
        <option key={year} value={year}>
          {year}
        </option>
      );
    }
    return years;
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      const timeLabel = hour < 10 ? `0${hour}:00` : `${hour}:00`;
      times.push(
        <option key={hour} value={timeLabel}>
          {timeLabel}
        </option>
      );
    }
    return times;
  };

  const handleCnicChange = (e) => {
    const { name, value } = e.target;
    if (name === "cnic") {
      setUser((prevUser) => ({
        ...prevUser,
        [name]: value.slice(0, 13).replace(/\D/g, ""),
      }));
    } else {
      setUser((prevUser) => ({ ...prevUser, [name]: value }));
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center text-primary mb-4">Complete Your Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3 text-center">
          {previewImage ? (
            <img
              src={previewImage}
              alt="Profile Preview"
              className="rounded-circle"
              width="100"
              height="100"
            />
          ) : (
            <FontAwesomeIcon icon={faUser} className="display-1" />
          )}
          <div>
            <label htmlFor="profileImage" className="btn btn-primary mt-2">
              Choose Profile Picture
            </label>
            <input
              type="file"
              id="profileImage"
              onChange={handleImageChange}
              className="d-none"
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">
            <FontAwesomeIcon icon={faUser} /> Full Name:
          </label>
          <input
            type="text"
            name="fullName"
            value={user.fullName}
            onChange={handleInputChange}
            required
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">
            <FontAwesomeIcon icon={faAddressCard} /> CNIC:
          </label>
          <input
            type="text"
            name="cnic"
            value={user.cnic}
            onChange={handleCnicChange}
            required
            className="form-control"
            pattern="[0-9]{13}"
            title="Please enter a valid 13-digit CNIC number"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">
            <FontAwesomeIcon icon={faUserDoctor} /> Specialization:
          </label>
          <input
            type="text"
            name="specialization"
            value={user.specialization}
            onChange={handleInputChange}
            required
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">
            <FontAwesomeIcon icon={faGraduationCap} /> Education:
          </label>
          {user.education.map((edu, index) => (
            <div key={index} className="border p-2 mb-2">
              <input
                type="text"
                name="degree"
                value={edu.degree}
                onChange={(e) =>
                  handleEducationChange(index, "degree", e.target.value)
                }
                placeholder="Degree"
                required
                className="form-control mb-2"
              />
              <input
                type="text"
                name="institution"
                value={edu.institution}
                onChange={(e) =>
                  handleEducationChange(index, "institution", e.target.value)
                }
                placeholder="Institution"
                required
                className="form-control mb-2"
              />
              <div className="d-flex">
                <select
                  value={edu.startYear}
                  onChange={(e) =>
                    handleEducationChange(index, "startYear", e.target.value)
                  }
                  className="form-select me-2"
                  required
                >
                  <option value="">Start Year</option>
                  {generateYearOptions()}
                </select>
                <select
                  value={edu.endYear}
                  onChange={(e) =>
                    handleEducationChange(index, "endYear", e.target.value)
                  }
                  className="form-select"
                  required
                >
                  <option value="">End Year</option>
                  {generateYearOptions()}
                </select>
              </div>
              {user.education.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEducationField(index)}
                  className="btn btn-danger mt-2"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addEducationField}
            className="btn btn-primary"
          >
            Add Education
          </button>
        </div>

        <button type="submit" className="btn btn-success mt-3">
          Submit
        </button>
      </form>
    </div>
  );
};

export default UserProfileCompletion;
