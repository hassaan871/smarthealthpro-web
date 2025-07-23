import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import localforage from "localforage";
import {
  uploadPublicKeys,
  generatePreKeys,
  generateKeyPair,
} from "../../../encrypt/Crypto.js";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { user, checkSession } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      console.log("✅ User already logged in — redirecting to dashboard");
      navigate("/dashboard/overview");
    }
  }, [user]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      console.log("Attempting to log in with:", { email, password });
      const response = await api.post("/login", {
        email,
        password,
        isMobileClient: false, // explicitly say it's web
      });

      const result = response.data;
      console.log("Login response:", result);

      if (result.message === "Login successful") {
        console.log("Login successful:", result);

        await checkSession();
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-dark d-flex align-items-center justify-content-center py-5">
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

          .btn-outline-light {
            padding: 0.75rem;
            font-size: 1rem;
            background: transparent;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            transition: all 0.3s ease;
          }

          // .btn-outline-light:hover {
          //   background: rgba(255, 255, 255, 0.1);
          //   transform: translateY(-1px);
          // }

          .divider {
            display: flex;
            align-items: center;
            text-align: center;
            margin: 1.5rem 0;
          }

          .divider::before,
          .divider::after {
            content: '';
            flex: 1;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }

          .divider span {
            padding: 0 1rem;
            color: rgba(255, 255, 255, 0.7);
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

          .alert-danger {
            background: rgba(220, 53, 69, 0.1);
            border: 1px solid rgba(220, 53, 69, 0.2);
            color: #dc3545;
            border-radius: 8px;
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
                Welcome to SmartHealth Pro, Doctor!
                <br />
                <br />
                Your expertise meets innovation here at SmartHealth Pro. Our
                platform helps you manage patients with diabetes and
                hypertension efficiently, providing tools and insights needed
                for exceptional care.
                <br />
                <br />
                With AI-driven summaries, seamless scheduling, and real-time
                alerts, focus on what you do best—caring for patients. Our
                secure, user-friendly interface enhances your workflow and
                patient outcomes.
              </p>
            </div>
          </div>

          {/* Login Section */}
          <div className="col-md-6">
            <div className="form-section">
              <h2 className="text-white text-center mb-4">Login</h2>
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                  />
                  <div className="icon-wrapper">
                    <Mail size={20} />
                  </div>
                </div>

                <div className="form-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                  />
                  <div
                    className="icon-wrapper"
                    style={{ pointerEvents: "auto", cursor: "pointer" }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </div>
                </div>

                {error && (
                  <div className="alert alert-danger py-2 mb-3" role="alert">
                    {error}
                  </div>
                )}

                <button type="submit" className="btn btn-primary w-100">
                  Login
                </button>

                <div className="mt-3 text-end">
                  <a href="/forgot-password" className="forgot-password">
                    Forgot Password?
                  </a>
                </div>

                <div className="divider">
                  <span>or</span>
                </div>

                <button
                  type="button"
                  className="btn btn-outline-light w-100"
                  onClick={() => navigate("/signup")}
                >
                  Sign up
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
