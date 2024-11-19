import React, { useState } from "react";
import { User, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

function SignUpStep1({ formData, updateFormData, onNext }) {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Password and confirm password do not match");
      return;
    }

    setError("");
    onNext();
  };

  return (
    <div className="main-container">
      <style>
        {`
          .main-container {
            background: #1a1d21;
            border-radius: 20px;
            overflow: hidden;
            max-width: 1000px;
            width: 100%;
            margin: 0 15px;
          }

          .welcome-section {
            background: #0D6EFD;
            padding: 3rem;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }

          .form-section {
            background: #1a1d21;
            padding: 3rem;
          }

          .form-control {
            background: rgba(30, 34, 40, 0.9) !important;
            border: none !important;
            color: white !important;
            padding: 0.75rem 1rem;
            font-size: 1rem;
            border-radius: 8px;
            height: auto;
          }

          .form-control:focus {
            background: rgba(30, 34, 40, 1) !important;
            box-shadow: 0 0 0 2px rgba(13, 110, 253, 0.25) !important;
          }

          .form-control::placeholder {
            color: rgba(255, 255, 255, 0.5) !important;
          }

          .icon-wrapper {
            position: absolute;
            right: 1rem;
            top: 50%;
            transform: translateY(-50%);
            color: rgba(255, 255, 255, 0.5);
            pointer-events: none;
          }

          .form-group {
            position: relative;
            margin-bottom: 1.5rem;
          }

          .btn-primary {
            padding: 0.75rem;
            font-size: 1rem;
            background: #0D6EFD;
            border: none;
            border-radius: 8px;
            transition: all 0.3s ease;
          }

          .btn-primary:hover {
            background: #0b5ed7;
            transform: translateY(-1px);
          }
        `}
      </style>

      <div className="row g-0">
        <div className="col-md-6">
          <div className="welcome-section">
            <h2 className="text-white mb-4">Welcome Back!</h2>
            <p className="text-white mb-0" style={{ opacity: 0.9 }}>
              Welcome, Doctor! To stay connected and manage your appointments
              with ease, please sign up using your personal information. Smart
              Health Pro offers secure access to patient records and a seamless
              online booking experience.
            </p>
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-section">
            <h2 className="text-white text-center mb-4">Create Account</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  value={formData.fullName}
                  onChange={(e) => updateFormData({ fullName: e.target.value })}
                  placeholder="Name"
                  required
                />
                <div className="icon-wrapper">
                  <User size={20} />
                </div>
              </div>

              <div className="form-group">
                <input
                  type="email"
                  className="form-control"
                  value={formData.email}
                  onChange={(e) => updateFormData({ email: e.target.value })}
                  placeholder="Email"
                  required
                />
                <div className="icon-wrapper">
                  <Mail size={20} />
                </div>
              </div>

              <div className="form-group">
                <input
                  type="password"
                  className="form-control"
                  value={formData.password}
                  onChange={(e) => updateFormData({ password: e.target.value })}
                  placeholder="Password"
                  required
                />
                <div className="icon-wrapper">
                  <Lock size={20} />
                </div>
              </div>

              <div className="form-group">
                <input
                  type="password"
                  className="form-control"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    updateFormData({ confirmPassword: e.target.value })
                  }
                  placeholder="Confirm Password"
                  required
                />
                <div className="icon-wrapper">
                  <Lock size={20} />
                </div>
              </div>

              {error && (
                <div className="alert alert-danger py-2 mb-3" role="alert">
                  {error}
                </div>
              )}

              <button type="submit" className="btn btn-primary w-100">
                Continue
              </button>

              <div className="text-center mt-3">
                <span className="text-light opacity-75">
                  Already have an account?{" "}
                </span>
                <a
                  href="#"
                  className="text-primary text-decoration-none"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/login");
                  }}
                >
                  Log in
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpStep1;
