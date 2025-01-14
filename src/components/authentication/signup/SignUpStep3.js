import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SignUpStep3({ formData, onBack, onComplete }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState("");

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
    setImageError("");
  };

  const uploadImage = async () => {
    if (!image) {
      setImageError("Profile picture is required.");
      return null;
    }

    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await axios.post(
        "http://localhost:5000/user/uploadPic",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Image upload response:", response.data);
      return response.data.avatar.url;
    } catch (error) {
      setImageError("Error uploading profile picture. Please try again.");
      console.error("Error uploading profile picture:", error);
      return null;
    }
  };

  const transformFormData = (formData) => {
    const transformedData = { ...formData };

    const transformedHours = {};
    Object.entries(formData.officeHours).forEach(([day, hours]) => {
      if (hours.status === "Closed") {
        transformedHours[day] = "Closed";
      } else {
        const convertTo12Hour = (time24) => {
          const [hours, minutes] = time24.split(":");
          const hour = parseInt(hours);
          const ampm = hour >= 12 ? "PM" : "AM";
          const hour12 = hour % 12 || 12;
          return `${hour12}:${minutes} ${ampm}`;
        };

        const openTime = convertTo12Hour(hours.openTime);
        const closeTime = convertTo12Hour(hours.closeTime);
        transformedHours[day] = `${openTime} - ${closeTime}`;
      }
    });

    const transformedEducation = formData.education.map((edu) => ({
      ...edu,
      year: edu.year,
    }));

    return {
      ...transformedData,
      officeHours: transformedHours,
      education: transformedEducation,
      confirmPassword: undefined,
    };
  };

  const handleCompleteRegistration = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    // setImageError("");

    // const imageUrl = await uploadImage();
    // if (!imageUrl) {
    //   setIsLoading(false);
    //   return;
    // }

    try {
      const transformedData = transformFormData({
        ...formData,
        role: "doctor",
        // profilePicture: imageUrl,
      });

      console.log("Data to upload:", transformedData);

      const response = await axios.post(
        "http://localhost:5000/user/register",
        transformedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response from API:", response.data);

      if (response.status === 200 || response.status === 201) {
        console.log("Registration successful, navigating to login page");
        navigate("/login");
      } else {
        setError("Registration failed. Please try again.");
        console.error("Registration failed:", response.data);
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "An error occurred during registration. Please try again."
      );
      console.error("Error during registration:", error);
    } finally {
      onComplete();
      setIsLoading(false);
    }
  };

  return (
    <div className="main-container">
      <style>
        {`
          .main-container {
            background: #1a1d21;
            border-radius: 20px;
            overflow: hidden;
            max-width: 600px;
            width: 100%;
            margin: 0 15px;
          }
          .section-title {
            color: #fff;
            font-size: 2rem;
            font-weight: 600;
            margin-bottom: 1rem;
          }
          .completion-text {
            color: rgba(255, 255, 255, 0.7);
            font-size: 1.1rem;
            line-height: 1.6;
            margin-bottom: 2rem;
          }
          .btn-primary {
            padding: 0.8rem 2rem;
            font-size: 1.1rem;
            background: #0D6EFD;
            border: none;
            border-radius: 8px;
            transition: all 0.3s ease;
          }
          .btn-primary:hover {
            background: #0b5ed7;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(13, 110, 253, 0.2);
          }
          .btn-outline-light {
            padding: 0.8rem 2rem;
            font-size: 1.1rem;
            background: transparent;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            transition: all 0.3s ease;
          }
          .completion-icon {
            font-size: 4rem;
            color: #28a745;
            margin-bottom: 1.5rem;
          }
          .alert-danger {
            background: rgba(220, 53, 69, 0.1);
            border: 1px solid rgba(220, 53, 69, 0.2);
            color: #dc3545;
          }
        `}
      </style>

      <div className="p-4 p-md-5">
        <div className="text-center">
          <div className="completion-icon">✓</div>
          <h2 className="section-title mb-4">Almost There!</h2>
          <p className="completion-text">
            You're just one click away from completing your registration. Click
            'Complete Registration' to finalize your account setup and join our
            healthcare professional community.
          </p>

          {error && (
            <div className="alert alert-danger mb-4" role="alert">
              {error}
            </div>
          )}

          {/* <div className="mb-3">
            <label htmlFor="profilePicture" className="form-label text-white">
              Upload Profile Picture
            </label>
            <input
              type="file"
              className="form-control"
              id="profilePicture"
              onChange={handleImageChange}
              disabled={isLoading}
            />
            {imageError && (
              <div className="alert alert-danger mt-2" role="alert">
                {imageError}
              </div>
            )}
          </div> */}

          <div className="d-flex flex-column gap-3">
            <button
              type="button"
              className="btn btn-primary w-100"
              onClick={handleCompleteRegistration}
              disabled={isLoading}
            >
              {isLoading ? (
                <span>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Completing Registration...
                </span>
              ) : (
                "Complete Registration"
              )}
            </button>

            <button
              type="button"
              className="btn btn-outline-light"
              onClick={onBack}
              disabled={isLoading}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpStep3;
