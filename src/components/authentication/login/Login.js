import React, { useState } from 'react';
import './Login.css';  // Import the CSS file

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle login logic here (e.g., send email and password to the server)
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <div className="login-wrapper">
      <div className="info-section">
        <h1 className="app-title">SmartHealthPro</h1>
        <p className="welcome-text">
          Welcome to SmartHealth Pro, Doctor!<br /><br />
          Your expertise meets innovation here at SmartHealth Pro. Our platform helps you manage patients with diabetes and hypertension efficiently, providing tools and insights needed for exceptional care.<br /><br />
          With AI-driven summaries, seamless scheduling, and real-time alerts, focus on what you do best—caring for patients. Our secure, user-friendly interface enhances your workflow and patient outcomes.<br /><br />
          Log in now and experience the future of healthcare. Together, let's make a difference, one patient at a time!
        </p>
      </div>
      <div className="login-section">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input 
              id="email"
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input 
              id="password"
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="form-input"
            />
          </div>
          <button type="submit" className="login-button">Login</button>
          <div className="extra-options">
            <a href="#" className="forgot-password">Forgot Password?</a>
          </div>
          <div className="divider">
            <hr />
            <span>or</span>
          </div>
          <button type="button" className="signup-button">Sign up</button>
        </form>
      </div>
    </div>
  );
}

export default Login;