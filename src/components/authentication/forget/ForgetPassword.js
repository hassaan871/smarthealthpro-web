import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../../.././api/axiosInstance"; // Import your axios instance

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleForgotPassword = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post(`/user/forgot-password`, {
        email,
      });
      setMessage(response.data.msg);
      setError(""); // Clear any previous errors
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred");
      setMessage("");
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div
        className="row shadow-lg p-5 bg-white rounded w-100"
        style={{ maxWidth: "600px" }}
      >
        <h2 className="text-primary text-center mb-4">Forgot Password</h2>
        <form onSubmit={handleForgotPassword}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email:
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-control"
            />
          </div>
          {error && <p className="text-danger">{error}</p>}
          {message && <p className="text-success">{message}</p>}
          <button type="submit" className="btn btn-primary w-100">
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
