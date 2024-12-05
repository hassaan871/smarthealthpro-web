import React, { useState, useEffect } from "react";
import SignUpStep1 from "./SignUpStep1";
import SignUpStep2 from "./SignUpStep2";
import SignUpStep3 from "./SignUpStep3";

function SignUp() {
  // Initialize state from localStorage if available, otherwise use default values
  const [step, setStep] = useState(() => {
    const savedStep = localStorage.getItem("signupStep");
    return savedStep ? parseInt(savedStep) : 1;
  });

  const [formData, setFormData] = useState(() => {
    const savedFormData = localStorage.getItem("signupFormData");
    return savedFormData
      ? JSON.parse(savedFormData)
      : {
          // Basic Data (Step 1)
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",

          // Additional Data (Step 2)
          specialization: "",
          cnic: "",
          address: "",
          about: "",
          education: [{ degree: "", institution: "", year: "" }],
          officeHours: {
            sunday: { status: "Closed", openTime: "", closeTime: "" },
            monday: { status: "Closed", openTime: "", closeTime: "" },
            tuesday: { status: "Closed", openTime: "", closeTime: "" },
            wednesday: { status: "Closed", openTime: "", closeTime: "" },
            thursday: { status: "Closed", openTime: "", closeTime: "" },
            friday: { status: "Closed", openTime: "", closeTime: "" },
            saturday: { status: "Closed", openTime: "", closeTime: "" },
          },
        };
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("signupStep", step);
  }, [step]);

  useEffect(() => {
    localStorage.setItem("signupFormData", JSON.stringify(formData));
  }, [formData]);

  const nextStep = () => {
    window.scrollTo(0, 0);
    setStep(step + 1);
  };

  const prevStep = () => {
    window.scrollTo(0, 0);
    setStep(step - 1);
  };

  const updateFormData = (newData) => {
    setFormData((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  // Optional: Add a function to reset the form
  const resetForm = () => {
    console.log("cleaning ");
    localStorage.removeItem("signupStep");
    localStorage.removeItem("signupFormData");
    setStep(1);
    setFormData({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      specialization: "",
      cnic: "",
      address: "",
      about: "",
      education: [{ degree: "", institution: "", year: "" }],
      officeHours: {
        sunday: { status: "Closed", openTime: "", closeTime: "" },
        monday: { status: "Closed", openTime: "", closeTime: "" },
        tuesday: { status: "Closed", openTime: "", closeTime: "" },
        wednesday: { status: "Closed", openTime: "", closeTime: "" },
        thursday: { status: "Closed", openTime: "", closeTime: "" },
        friday: { status: "Closed", openTime: "", closeTime: "" },
        saturday: { status: "Closed", openTime: "", closeTime: "" },
      },
    });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <SignUpStep1
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <SignUpStep2
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <SignUpStep3
            formData={formData}
            onBack={prevStep}
            onComplete={() => {
              // When form is submitted successfully, reset the stored data
              resetForm();
            }}
          />
        );
      default:
        return <SignUpStep1 />;
    }
  };

  return (
    <div className="min-h-screen bg-dark">
      <style>
        {`
          .signup-progress {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: rgba(255, 255, 255, 0.1);
            z-index: 1000;
          }

          .progress-bar {
            height: 100%;
            background: #0D6EFD;
            transition: width 0.3s ease;
          }

          .step-indicator {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(13, 110, 253, 0.1);
            padding: 8px 16px;
            border-radius: 20px;
            color: #fff;
            font-size: 14px;
            z-index: 1000;
          }
        `}
      </style>

      {/* Progress Bar */}
      <div className="signup-progress">
        <div
          className="progress-bar"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      {/* Step Indicator */}
      <div className="step-indicator">Step {step} of 3</div>

      {/* Main Content */}
      <div className="container d-flex align-items-center justify-content-center min-vh-100 py-5">
        {renderStep()}
      </div>
    </div>
  );
}

export default SignUp;
