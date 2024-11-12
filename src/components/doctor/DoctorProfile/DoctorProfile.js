import React, { useState, useEffect } from "react";
import axios from "axios";

const DoctorProfile = () => {
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
      className="container-fluid"
      style={{ marginTop: "75px", width: "90vw" }}
    >
      <div className="row">
        <div className="col-md-6">
          <div className="card mt-4">
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
                      <strong>
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
          <h2 className="mb-4 mt-4">Edit Profile</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="fullName" className="form-label">
                Full Name{" "}
                {hasFieldChanged("fullName") && (
                  <span className="text-primary">*</span>
                )}
              </label>
              <input
                type="text"
                className={`form-control ${
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
              <label htmlFor="specialization" className="form-label">
                Specialization{" "}
                {hasFieldChanged("specialization") && (
                  <span className="text-primary">*</span>
                )}
              </label>
              <input
                type="text"
                className={`form-control ${
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
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
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
              <label htmlFor="cnic" className="form-label">
                CNIC{" "}
                {hasFieldChanged("cnic") && (
                  <span className="text-primary">*</span>
                )}
              </label>
              <input
                type="text"
                className={`form-control ${errors.cnic ? "is-invalid" : ""} ${
                  hasFieldChanged("cnic") ? "border-primary" : ""
                }`}
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
              <label htmlFor="address" className="form-label">
                Address
              </label>
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
              <label htmlFor="about" className="form-label">
                About
              </label>
              <textarea
                className="form-control"
                id="about"
                name="about"
                value={doctor.about}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">
                Clinic Hours{" "}
                {hasFieldChanged("officeHours") && (
                  <span className="text-primary">*</span>
                )}
              </label>
              {Object.entries(doctor.officeHours).map(([day, hours]) => (
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
                        onChange={(e) =>
                          handleOfficeHoursChange(day, "status", e.target.value)
                        }
                        className={`form-select ${
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
                            className={`form-control ${
                              hasFieldChanged("officeHours")
                                ? "border-primary"
                                : ""
                            }`}
                          />
                          <span className="input-group-text">to</span>
                          <input
                            type="time"
                            value={getDefaultTimes(hours).end}
                            onChange={(e) =>
                              handleOfficeHoursChange(day, "times", [
                                getDefaultTimes(hours).start,
                                e.target.value,
                              ])
                            }
                            className={`form-control ${
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
    </div>
  );
};

export default DoctorProfile;
