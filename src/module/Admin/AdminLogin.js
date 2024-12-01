import React from "react";
import { Mail, Lock } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

function AdminLogin() {
  return (
    <div className="min-vh-100 bg-dark d-flex align-items-center justify-content-center py-5">
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

          .forgot-password {
            color: #0D6EFD;
            text-decoration: none;
            transition: all 0.3s ease;
          }

          .forgot-password:hover {
            color: #0b5ed7;
            text-decoration: underline;
          }
        `}
      </style>

      <div className="main-container">
        <div className="row g-0">
          {/* Info Section */}
          <div className="col-md-6">
            <div className="welcome-section">
              <h2 className="text-white mb-4">Welcome Back!</h2>
              <p className="text-white mb-0" style={{ opacity: 0.9 }}>
                Welcome to SmartHealth Pro, Admin!
                <br />
                <br />
                Manage the SmartHealth Pro platform with ease. As an admin, you
                have the tools to oversee operations, manage user accounts, and
                ensure smooth functionality.
                <br />
                <br />
                Stay organized with an intuitive dashboard, comprehensive
                analytics, and secure controls to streamline the management
                experience. Thank you for keeping SmartHealth Pro running
                efficiently!
              </p>
            </div>
          </div>

          {/* Login Section */}
          <div className="col-md-6">
            <div className="form-section">
              <h2 className="text-white text-center mb-4">Admin Login</h2>
              <form>
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Admin Email"
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
                    placeholder="Password"
                    required
                  />
                  <div className="icon-wrapper">
                    <Lock size={20} />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Login
                </button>

                <div className="mt-3 text-end">
                  <a href="/forgot-password" className="forgot-password">
                    Forgot Password?
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
