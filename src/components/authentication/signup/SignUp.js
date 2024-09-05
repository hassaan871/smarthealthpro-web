import React, { useState } from 'react';
import axiosInstance from '../../../axiosInstance';
import './SignUp.css';
import { User, Mail, Lock, Phone } from 'lucide-react';

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }
    try {
      await axiosInstance.post('/auth/signup', {
        name,
        email,
        password,
        specialty,
        contactNumber,
      });
      window.location.href = '/login'; // Redirect to login after successful sign-up
    } catch (err) {
      setError('Failed to register. Please try again.');
    }
  };

  return (
    <div className="signup-container">
      <div className="welcome-back">
        <h2 className="welcome-title">Welcome Back!</h2>
        <p className="welcome-text">
          Welcome, Doctor! To stay connected and manage your appointments with ease, 
          please log in using your personal information. Smart Health Pro offers secure 
          access to patient records and a seamless online booking experience.
        </p>
        <button className="sign-in-button">SIGN IN</button>
      </div>
      <div className="signup-form-container">
        <h2 className="signup-title">Create Account</h2>
        <div className="social-signup">
          <div className="social-button">f</div>
          <div className="social-button">G+</div>
          <div className="social-button">in</div>
        </div>
        <p>or use your email for registration:</p>
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Name"
              required 
              className="form-input"
            />
            <User className="input-icon" size={20} />
          </div>
          <div className="form-group">
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Email"
              required 
              className="form-input"
            />
            <Mail className="input-icon" size={20} />
          </div>
          <div className="form-group">
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Password"
              required 
              className="form-input"
            />
            <Lock className="input-icon" size={20} />
          </div>
          <div className="form-group">
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              placeholder="Confirm Password"
              required 
              className="form-input"
            />
            <Lock className="input-icon" size={20} />
          </div>
          <div className="form-group">
            <select 
              value={specialty} 
              onChange={(e) => setSpecialty(e.target.value)} 
              required 
              className="form-input"
            >
              <option value="">Select Specialty</option>
              <option value="heart">Heart</option>
              <option value="diabetes">Diabetes</option>
              <option value="blood pressure">Blood Pressure</option>
            </select>
          </div>
          <div className="form-group">
            <input 
              type="tel" 
              value={contactNumber} 
              onChange={(e) => setContactNumber(e.target.value)} 
              placeholder="Contact Number"
              required 
              className="form-input"
            />
            <Phone className="input-icon" size={20} />
          </div>
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="signup-button">SIGN UP</button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;