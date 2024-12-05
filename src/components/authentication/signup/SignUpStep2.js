import React, { useState } from "react";
import axios from "axios";

function SignUpStep2({ formData, updateFormData, onNext, onBack }) {
  const [cnicError, setCnicError] = useState("");
  const [isCheckingCnic, setIsCheckingCnic] = useState(false);

  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...formData.education];
    if (field === "year") {
      value = formatYear(value);
    }
    updatedEducation[index][field] = value;
    updateFormData({ education: updatedEducation });
  };

  const formatTimeString = (timeStr) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleOfficeHoursChange = (day, field, value) => {
    updateFormData({
      officeHours: {
        ...formData.officeHours,
        [day]: {
          ...formData.officeHours[day],
          [field]: value,
        },
      },
    });
  };

  // New function to check CNIC uniqueness
  const checkCnicUniqueness = async (cnic) => {
    if (cnic.length === 15) {
      try {
        setIsCheckingCnic(true);
        setCnicError("");

        const response = await axios.get(
          `http://localhost:5000/check-cnic/${cnic}`
        );
        return true; // CNIC is unique
      } catch (error) {
        if (error.response?.status === 400) {
          setCnicError(error.response.data.message);
        } else {
          setCnicError("Error checking CNIC availability. Please try again.");
        }
        return false;
      } finally {
        setIsCheckingCnic(false);
      }
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (cnicError) {
      return;
    }

    const isUnique = await checkCnicUniqueness(formData.cnic);
    if (isUnique) {
      onNext();
    }
  };

  const addEducation = () => {
    updateFormData({
      education: [
        ...formData.education,
        { degree: "", institution: "", year: "" },
      ],
    });
  };

  const removeEducation = (index) => {
    if (formData.education.length > 1) {
      const updatedEducation = formData.education.filter((_, i) => i !== index);
      updateFormData({ education: updatedEducation });
    }
  };

  const formatYear = (value) => {
    // If backspace is hitting the dash, remove the last digit of first year too
    if (value.endsWith(" - ")) {
      return value.slice(0, -3);
    }

    const numeric = value.replace(/[^0-9]/g, "");
    let formatted = numeric;
    if (numeric.length >= 4) {
      formatted = formatted.slice(0, 4) + " - " + formatted.slice(4);
    }
    return formatted.slice(0, 11);
  };

  // Format CNIC with dashes
  const formatCNIC = (value) => {
    const numeric = value.replace(/[^0-9]/g, "");
    let formatted = numeric;
    if (numeric.length > 5)
      formatted = formatted.slice(0, 5) + "-" + formatted.slice(5);
    if (numeric.length > 12)
      formatted = formatted.slice(0, 13) + "-" + formatted.slice(13);
    return formatted.slice(0, 15);
  };

  // Handle CNIC change with validation
  const handleCnicChange = async (e) => {
    const formattedCnic = formatCNIC(e.target.value);
    updateFormData({ cnic: formattedCnic });

    if (formattedCnic.length === 15) {
      await checkCnicUniqueness(formattedCnic);
    } else {
      setCnicError("");
    }
  };

  return (
    <div className="min-h-screen bg-dark py-5">
      <style>
        {`
          .form-control::placeholder,
          .form-select::placeholder {
            color: rgba(255, 255, 255, 0.7) !important;
          }
          .form-select {
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e") !important;
          }
          .custom-card {
            background: rgba(33, 37, 41, 0.9);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 15px;
          }
          .section-card {
            background: rgba(33, 37, 41, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
          }
          .form-control, .form-select {
            background-color: rgba(33, 37, 41, 0.7) !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            color: white !important;
            transition: all 0.3s ease;
          }
          .form-control:focus, .form-select:focus {
            background-color: rgba(33, 37, 41, 0.9) !important;
            border-color: rgba(255, 255, 255, 0.5) !important;
            box-shadow: 0 0 0 0.25rem rgba(255, 255, 255, 0.1);
          }
          .section-title {
            color: #fff;
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid rgba(255, 255, 255, 0.1);
          }
          input[type="time"] {
            color-scheme: dark;
          }
          .time-picker-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
          }
          .time-picker-label {
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.875rem;
            margin-bottom: 0.25rem;
          }
          .invalid-feedback {
            display: block;
            color: #dc3545;
            margin-top: 0.25rem;
          }
        `}
      </style>

      <div className="container">
        <div className="custom-card p-4 p-md-5">
          <h2 className="text-center text-light mb-5">Complete Your Profile</h2>

          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              {/* Personal Information Section */}
              <div className="col-md-6">
                <div className="section-card">
                  <h5 className="section-title">Personal Information</h5>
                  <div className="mb-4">
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        value={formData.specialization}
                        onChange={(e) =>
                          updateFormData({ specialization: e.target.value })
                        }
                        placeholder="Specialization"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <div className="position-relative">
                        <input
                          type="text"
                          className={`form-control ${
                            cnicError ? "is-invalid" : ""
                          }`}
                          value={formData.cnic}
                          onChange={handleCnicChange}
                          placeholder="CNIC (e.g., 12345-6789012-3)"
                          required
                          maxLength={15}
                        />
                        {isCheckingCnic && (
                          <div className="position-absolute top-50 end-0 translate-middle-y me-2">
                            <div
                              className="spinner-border spinner-border-sm text-light"
                              role="status"
                            >
                              <span className="visually-hidden">
                                Checking CNIC...
                              </span>
                            </div>
                          </div>
                        )}
                        {cnicError && (
                          <div className="invalid-feedback">{cnicError}</div>
                        )}
                      </div>
                    </div>
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        value={formData.address}
                        onChange={(e) =>
                          updateFormData({ address: e.target.value })
                        }
                        placeholder="Complete Address"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <textarea
                        className="form-control"
                        value={formData.about}
                        onChange={(e) =>
                          updateFormData({ about: e.target.value })
                        }
                        placeholder="About yourself and your medical experience"
                        rows="4"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Education Section */}
                <div className="section-card">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="section-title mb-0">Education</h5>
                    <button
                      type="button"
                      className="btn btn-outline-light btn-sm"
                      onClick={addEducation}
                    >
                      + Add Education
                    </button>
                  </div>

                  {formData.education.map((edu, index) => (
                    <div key={index} className="mb-4 p-3 bg-dark rounded">
                      <div className="row g-3">
                        <div className="col-md-12">
                          <input
                            type="text"
                            className="form-control"
                            value={edu.degree}
                            placeholder="Degree (e.g., MBBS, Fellowship in Cardiology)"
                            onChange={(e) =>
                              handleEducationChange(
                                index,
                                "degree",
                                e.target.value
                              )
                            }
                            required
                          />
                        </div>
                        <div className="col-md-12">
                          <input
                            type="text"
                            className="form-control"
                            value={edu.institution}
                            onChange={(e) =>
                              handleEducationChange(
                                index,
                                "institution",
                                e.target.value
                              )
                            }
                            placeholder="Institution Name"
                            required
                          />
                        </div>
                        <div className="col-md-12">
                          <input
                            type="text"
                            className="form-control"
                            value={edu.year}
                            onChange={(e) =>
                              handleEducationChange(
                                index,
                                "year",
                                e.target.value
                              )
                            }
                            placeholder="Year (e.g., 2000 - 2005)"
                            maxLength={11}
                            required
                          />
                        </div>
                        {formData.education.length > 1 && (
                          <div className="col-md-12">
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => removeEducation(index)}
                            >
                              Remove Education
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Office Hours Section */}
              <div className="col-md-6">
                <div className="section-card">
                  <h5 className="section-title">Office Hours</h5>
                  {[
                    "monday",
                    "tuesday",
                    "wednesday",
                    "thursday",
                    "friday",
                    "saturday",
                    "sunday",
                  ].map((day) => (
                    <div className="mb-4" key={day}>
                      <div className="d-flex align-items-center mb-2">
                        <div className="text-light" style={{ width: "100px" }}>
                          {day.charAt(0).toUpperCase() + day.slice(1)}
                        </div>
                        <select
                          className="form-select ms-2"
                          value={formData.officeHours[day].status}
                          onChange={(e) =>
                            handleOfficeHoursChange(
                              day,
                              "status",
                              e.target.value
                            )
                          }
                          required
                        >
                          <option value="Closed">Closed</option>
                          <option value="Open">Open</option>
                        </select>
                      </div>
                      {formData.officeHours[day].status === "Open" && (
                        <div className="ms-3 ps-4 border-start border-secondary">
                          <div className="time-picker-container">
                            <div>
                              <div className="time-picker-label">
                                Opening Time
                              </div>
                              <input
                                type="time"
                                className="form-control"
                                value={formData.officeHours[day].openTime}
                                onChange={(e) =>
                                  handleOfficeHoursChange(
                                    day,
                                    "openTime",
                                    e.target.value
                                  )
                                }
                                required
                              />
                            </div>
                            <div>
                              <div className="time-picker-label">
                                Closing Time
                              </div>
                              <input
                                type="time"
                                className="form-control"
                                value={formData.officeHours[day].closeTime}
                                onChange={(e) =>
                                  handleOfficeHoursChange(
                                    day,
                                    "closeTime",
                                    e.target.value
                                  )
                                }
                                required
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-between mt-4">
              <button
                type="button"
                className="btn btn-outline-light px-4"
                onClick={onBack}
              >
                Back
              </button>
              <button type="submit" className="btn btn-primary px-4">
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUpStep2;
