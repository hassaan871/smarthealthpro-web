import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Context from "../../context/context";
import { encrypt, decrypt } from "../../encrypt/Encrypt";

const DoctorProfile = () => {
  const { setUserInfo } = useContext(Context);
  const [doctor, setDoctor] = useState({
    specialization: "",
    cnic: "",
    email: "",
    address: "",
    about: "",
    officeHours: {
      monday: { status: "closed", time: "Closed" },
      tuesday: { status: "closed", time: "Closed" },
      wednesday: { status: "closed", time: "Closed" },
      thursday: { status: "closed", time: "Closed" },
      friday: { status: "closed", time: "Closed" },
      saturday: { status: "closed", time: "Closed" },
      sunday: { status: "closed", time: "Closed" },
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

  // Track original data for comparison
  const [originalData, setOriginalData] = useState(null);
  // Track changed fields
  const [changedFields, setChangedFields] = useState(new Set());
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top
  }, []);

  useEffect(() => {
    const fetchDoctorData = async () => {
      const userString = localStorage.getItem("userToken");
      const userId = userString;

      try {
        const userResponse = await axios.get(
          `http://localhost:5000/user/getUserInfo/${userId}`
        );
        const userData = userResponse.data.user;

        const doctorsResponse = await axios.get(
          "http://localhost:5000/user/getAllDoctors"
        );
        const doctorsData = doctorsResponse.data;

        const doctorData = doctorsData.find((doctor) => doctor.user === userId);
        const doctorId = doctorData ? doctorData._id : null;

        if (doctorId) {
          const doctorResponse = await axios.get(
            `http://localhost:5000/user/getDoctorById/${doctorId}`
          );
          const doctorDetails = doctorResponse.data;

          // Convert the fetched office hours to our internal format
          const formattedOfficeHours = {};
          Object.entries(doctorDetails.officeHours || {}).forEach(
            ([day, hours]) => {
              formattedOfficeHours[day] = {
                status: hours === "Closed" ? "closed" : "open",
                time: hours,
              };
            }
          );

          const User = {
            userData,
            doctor: doctorDetails,
          };

          console.log("User from setting: ", User);
          setDoctor((prevDoctor) => ({
            ...prevDoctor,
            ...doctorDetails,
            email: doctorDetails.user.email,
            officeHours: formattedOfficeHours,
          }));

          setOriginalData({
            ...doctorDetails,
            officeHours: formattedOfficeHours,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDoctorData();
  }, []);

  const convertTo24Hour = (timeStr) => {
    if (!timeStr) return "";
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":");

    hours = parseInt(hours, 10);
    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  };

  const convertTo12Hour = (timeStr) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const validateField = (name, value) => {
    switch (name) {
      case "fullName":
        return value.length < 3
          ? "Full name must be at least 3 characters long"
          : "";
      case "email":
        console.log("sd", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
        console.log("v", value);
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? ""
          : "Email address is invalid";
      case "cnic":
        return !/^\d{5}-\d{7}-\d$/.test(value)
          ? "CNIC must be in the format xxxxx-xxxxxxx-x"
          : "";
      default:
        return "";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "email" || name === "fullName") {
      setDoctor((prev) => ({
        ...prev,
        user: { ...prev.user, [name]: value },
      }));
      if (originalData?.user[name] !== value) {
        setChangedFields((prev) => new Set(prev.add(name)));
      } else {
        setChangedFields((prev) => {
          const newSet = new Set(prev);
          newSet.delete(name);
          return newSet;
        });
      }
    } else {
      setDoctor((prev) => ({ ...prev, [name]: value }));
      // Add visual indicators for these fields too
      if (originalData?.[name] !== value) {
        setChangedFields((prev) => new Set(prev.add(name)));
      } else {
        setChangedFields((prev) => {
          const newSet = new Set(prev);
          newSet.delete(name);
          return newSet;
        });
      }
    }

    const error = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const formatTimeForAPI = (time) => {
    if (!time) return "";
    try {
      const [hours, minutes] = time.split(":");
      const formattedHours = hours.padStart(2, "0");
      const formattedMinutes = minutes.padStart(2, "0");
      return `${formattedHours}:${formattedMinutes}`;
    } catch (e) {
      return "";
    }
  };
  const formatTimeForDisplay = (time) => {
    if (!time) return "";
    try {
      const timeObj = new Date(`2000-01-01T${time}`);
      return timeObj.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch (e) {
      return time;
    }
  };

  const handleOfficeHoursChange = (day, type, value) => {
    setDoctor((prevDoctor) => {
      const updatedHours = { ...prevDoctor.officeHours };

      if (type === "status") {
        updatedHours[day] = {
          status: value,
          time: value === "closed" ? "Closed" : updatedHours[day].time || "",
        };
      } else if (type === "times") {
        const [openTime, closeTime] = value;
        // Only update if we have both times
        if (openTime && closeTime) {
          updatedHours[day] = {
            status: "open",
            time: `${convertTo12Hour(openTime)} - ${convertTo12Hour(
              closeTime
            )}`,
          };
        } else if (openTime) {
          // If we only have start time, keep the existing end time if any
          const currentEndTime = getDefaultTimes(updatedHours[day]).end;
          updatedHours[day] = {
            status: "open",
            time: `${convertTo12Hour(openTime)} - ${
              currentEndTime ? convertTo12Hour(currentEndTime) : ""
            }`,
          };
        } else if (closeTime) {
          // If we only have end time, keep the existing start time if any
          const currentStartTime = getDefaultTimes(updatedHours[day]).start;
          updatedHours[day] = {
            status: "open",
            time: `${
              currentStartTime ? convertTo12Hour(currentStartTime) : ""
            } - ${convertTo12Hour(closeTime)}`,
          };
        }
      }

      setChangedFields((prev) => new Set(prev.add("officeHours")));

      return {
        ...prevDoctor,
        officeHours: updatedHours,
      };
    });
  };
  const getChangedData = () => {
    const changes = {};
    changedFields.forEach((field) => {
      if (field === "fullName" || field === "email") {
        changes[field] = doctor.user[field];
      } else if (field === "officeHours") {
        changes.officeHours = formatOfficeHoursForAPI(doctor.officeHours);
      } else {
        changes[field] = doctor[field];
      }
    });
    return changes;
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
        const changedData = getChangedData();

        console.log("changedData: ", changedData);
        console.log("userid: ", userId);
        const link = `http://localhost:5000/user/updateUser/${userId}`;
        console.log("link: ", link);
        if (Object.keys(changedData).length > 0) {
          const userResponse = await axios.put(link, changedData);
          setUpdateMessage("Profile updated successfully!");
          // Update original data with new values
          setOriginalData(doctor);
          // Clear changed fields
          setChangedFields(new Set());
        } else {
          setUpdateMessage("No changes to update!");
        }
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

  // Helper function to determine if a field has changed
  const hasFieldChanged = (fieldName) => changedFields.has(fieldName);

  const getDefaultTimes = (hours) => {
    if (hours.status === "closed" || !hours.time || hours.time === "Closed") {
      return { start: "", end: "" };
    }

    try {
      const [startTime, endTime] = hours.time.split(" - ");
      return {
        start: convertTo24Hour(startTime.trim()),
        end: convertTo24Hour(endTime.trim()),
      };
    } catch (error) {
      return { start: "", end: "" };
    }
  };

  const formatOfficeHoursForAPI = (officeHours) => {
    const formattedHours = {};
    Object.entries(officeHours).forEach(([day, hours]) => {
      formattedHours[day] = hours.status === "closed" ? "Closed" : hours.time;
    });
    return formattedHours;
  };
  return (
    <div
      className="container-fluid bg-gray-900"
      style={{
        width: "100vw",
        margin: "0",
        minHeight: "100vh",
        paddingBottom: 20,
      }}
    >
      <div className="row">
        <div className="col-md-6">
          <div className="card bg-gray-800 border-0 shadow-lg mt-4">
            <img
              src={
                doctor.user?.avatar?.url?.length > 0
                  ? doctor.user.avatar.url
                  : doctor.user.avatar
              }
              alt={doctor.user.fullName}
              className="card-img-top rounded-circle mx-auto mt-3"
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />
            <div className="card-body text-center">
              <h2 className="card-title text-white">{doctor.user.fullName}</h2>
              <p className="card-text text-gray-400">{doctor.specialization}</p>
            </div>
            <ul className="list-group list-group-flush bg-gray-800">
              <li className="list-group-item bg-gray-800 border-gray-700 text-gray-400">
                <strong className="text-white">Email:</strong>{" "}
                {doctor.user.email || "Not provided"}
              </li>
              <li className="list-group-item bg-gray-800 border-gray-700 text-gray-400">
                <strong className="text-white">CNIC:</strong> {doctor.cnic}
              </li>
              <li className="list-group-item bg-gray-800 border-gray-700 text-gray-400">
                <strong className="text-white">Address:</strong>{" "}
                {doctor.address}
              </li>
            </ul>
          </div>
          <div className="card bg-gray-800 border-0 shadow-lg mt-4">
            <div className="card-body">
              <h5 className="card-title text-white">About</h5>
              <p className="card-text text-gray-400">{doctor.about}</p>
            </div>
          </div>

          <div className="card bg-gray-800 border-0 shadow-lg mt-4">
            <div className="card-body">
              <h5 className="card-title text-white">Education</h5>
              <ul className="list-unstyled">
                {doctor.education &&
                  doctor.education.map((edu, index) => (
                    <li key={index} className="mb-2 text-gray-400">
                      <strong className="text-white">{edu.degree}</strong>
                      <br />
                      {edu.institution} ({edu.year})
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          <div className="card bg-gray-800 border-0 shadow-lg mt-4 mb-4">
            <div className="card-body">
              <h5 className="card-title text-white">Clinic Hours</h5>
              <ul className="list-unstyled">
                {doctor.officeHours &&
                  Object.entries(doctor.officeHours).map(([day, hours]) => (
                    <li key={day} className="mb-2 text-gray-400">
                      <strong className="text-white">
                        {day.charAt(0).toUpperCase() + day.slice(1)}:
                      </strong>{" "}
                      {hours.time}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <h2 className="mb-4 mt-4 text-white">Edit Profile</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="fullName" className="form-label text-gray-400">
                Full Name{" "}
                {hasFieldChanged("fullName") && (
                  <span className="text-primary">*</span>
                )}
              </label>
              <input
                type="text"
                className={`form-control bg-gray-700 border-0 text-white ${
                  errors.fullName ? "is-invalid" : ""
                } ${hasFieldChanged("fullName") ? "border-primary" : ""}`}
                id="fullName"
                name="fullName"
                value={doctor.user.fullName}
                onChange={handleInputChange}
                required
              />
              {errors.fullName && (
                <div className="invalid-feedback">{errors.fullName}</div>
              )}
            </div>

            <div className="mb-3">
              <label
                htmlFor="specialization"
                className="form-label text-gray-400"
              >
                Specialization{" "}
                {hasFieldChanged("specialization") && (
                  <span className="text-primary">*</span>
                )}
              </label>
              <input
                type="text"
                className={`form-control bg-gray-700 border-0 text-white ${
                  hasFieldChanged("specialization") ? "border-primary" : ""
                }`}
                id="specialization"
                name="specialization"
                value={doctor.specialization}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-3">
              <label
                htmlFor="profileImage"
                className="form-label text-gray-400"
              >
                Profile Picture
              </label>
              <input
                type="file"
                className="form-control bg-gray-700 border-0 text-white"
                id="profileImage"
                accept="image/*"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label text-gray-400">
                Email
              </label>
              <input
                type="email"
                className={`form-control bg-gray-700 border-0 text-white ${
                  errors.email ? "is-invalid" : ""
                }`}
                id="email"
                name="email"
                value={doctor.user.email}
                onChange={handleInputChange}
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="cnic" className="form-label text-gray-400">
                CNIC{" "}
                {hasFieldChanged("cnic") && (
                  <span className="text-primary">*</span>
                )}
              </label>
              <input
                type="text"
                className={`form-control bg-gray-700 border-0 text-white ${
                  errors.cnic ? "is-invalid" : ""
                } ${hasFieldChanged("cnic") ? "border-primary" : ""}`}
                id="cnic"
                name="cnic"
                value={doctor.cnic}
                onChange={handleInputChange}
                required
              />
              {errors.cnic && (
                <div className="invalid-feedback">{errors.cnic}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="address" className="form-label text-gray-400">
                Address
              </label>
              <textarea
                className="form-control bg-gray-700 border-0 text-white"
                id="address"
                name="address"
                value={doctor.address}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="about" className="form-label text-gray-400">
                About
              </label>
              <textarea
                className="form-control bg-gray-700 border-0 text-white"
                id="about"
                name="about"
                value={doctor.about}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label text-gray-400">
                Clinic Hours{" "}
                {hasFieldChanged("officeHours") && (
                  <span className="text-primary">*</span>
                )}
              </label>
              {Object.entries(doctor.officeHours).map(([day, hours]) => (
                <div key={day} className="mb-2">
                  <div className="row align-items-center">
                    <div className="col-md-3">
                      <label className="form-label text-gray-400">
                        {day.charAt(0).toUpperCase() + day.slice(1)}:
                      </label>
                    </div>
                    <div className="col-md-3">
                      <select
                        value={hours.status}
                        onChange={(e) =>
                          handleOfficeHoursChange(day, "status", e.target.value)
                        }
                        className={`form-select bg-gray-700 border-0 text-white ${
                          hasFieldChanged("officeHours") ? "border-primary" : ""
                        }`}
                      >
                        <option value="open">Open</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                    {hours.status === "open" && (
                      <div className="col-md-6">
                        <div className="input-group">
                          <input
                            type="time"
                            value={getDefaultTimes(hours).start}
                            onChange={(e) =>
                              handleOfficeHoursChange(day, "times", [
                                e.target.value,
                                getDefaultTimes(hours).end,
                              ])
                            }
                            className={`form-control bg-gray-700 border-0 text-white ${
                              hasFieldChanged("officeHours")
                                ? "border-primary"
                                : ""
                            }`}
                          />
                          <span className="input-group-text bg-gray-600 border-0 text-gray-400">
                            to
                          </span>
                          <input
                            type="time"
                            value={getDefaultTimes(hours).end}
                            onChange={(e) =>
                              handleOfficeHoursChange(day, "times", [
                                getDefaultTimes(hours).start,
                                e.target.value,
                              ])
                            }
                            className={`form-control bg-gray-700 border-0 text-white ${
                              hasFieldChanged("officeHours")
                                ? "border-primary"
                                : ""
                            }`}
                          />
                        </div>
                      </div>
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
              {isLoading
                ? "Updating..."
                : `Save Changes (${changedFields.size} modified)`}
            </button>
          </form>
          {updateMessage && (
            <div
              className={`alert ${
                updateMessage.includes("Failed")
                  ? "alert-danger"
                  : "alert-success"
              } mt-3`}
            >
              {updateMessage}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .bg-gray-900 {
          background-color: #111827;
        }
        .bg-gray-800 {
          background-color: #1f2937;
        }
        .bg-gray-700 {
          background-color: #374151;
        }
        .bg-gray-600 {
          background-color: #4b5563;
        }
        .text-gray-400 {
          color: #9ca3af;
        }
        .text-gray-300 {
          color: #d1d5db;
        }
        .border-gray-700 {
          border-color: #374151 !important;
        }

        .btn-gray-600 {
          background-color: #4b5563;
          border: none;
          color: #d1d5db;
        }

        .btn-gray-600:hover {
          background-color: #6b7280;
          color: #f3f4f6;
        }

        .form-control,
        .form-select,
        .input-group-text {
          background-color: #374151;
          border: none;
          color: #fff;
        }

        .form-control:focus,
        .form-select:focus {
          background-color: #4b5563;
          border-color: #6b7280;
          color: #f3f4f6;
          box-shadow: none;
        }
        .form-control::placeholder {
          color: #9ca3af;
        }

        .card {
          transition: transform 0.2s ease-in-out;
        }

        .card:hover {
          transform: translateY(-2px);
        }

        .invalid-feedback {
          color: #ef4444;
        }

        .alert-success {
          background-color: #065f46;
          color: #fff;
          border: none;
        }

        .alert-danger {
          background-color: #7f1d1d;
          color: #fff;
          border: none;
        }

        .form-label {
          margin-bottom: 0.5rem;
        }

        /* Custom styling for file input */
        input[type="file"] {
          color: #9ca3af;
        }

        input[type="file"]::-webkit-file-upload-button {
          background-color: #4b5563;
          border: none;
          color: #fff;
          padding: 0.375rem 0.75rem;
          margin-right: 1rem;
          border-radius: 0.25rem;
        }

        input[type="file"]::-webkit-file-upload-button:hover {
          background-color: #6b7280;
        }

        /* Hide scrollbar while maintaining functionality */
        ::-webkit-scrollbar {
          display: none;
        }

        /* For Firefox */
        * {
          scrollbar-width: none;
        }

        /* For IE/Edge */
        * {
          -ms-overflow-style: none;
        }
      `}</style>

      <style jsx global>{`
        body {
          background-color: #111827 !important;
          margin: 0;
          padding: 0;
        }

        #root {
          background-color: #111827;
          min-height: 100vh;
        }

        /* Override Bootstrap's default white backgrounds */
        .card,
        .card-header,
        .card-body {
          background-color: inherit;
        }

        /* Override Bootstrap's default borders */
        .card,
        .btn,
        .form-control {
          border: none;
        }

        /* Override select dropdown styles */
        select option {
          background-color: #374151;
          color: #fff;
        }
      `}</style>
    </div>
  );
};

export default DoctorProfile;
