// src/components/authentication/signup/SignUp.js
import React, { useState } from 'react';
import axiosInstance from '../../../axiosInstance';
import './SignUp.css';

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
      <h2 className="signup-title">Sign Up as Doctor</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <label>Name:</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Confirm Password:</label>
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Specialty:</label>
          <input 
            type="text" 
            value={specialty} 
            onChange={(e) => setSpecialty(e.target.value)} 
            required 
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Contact Number:</label>
          <input 
            type="tel" 
            value={contactNumber} 
            onChange={(e) => setContactNumber(e.target.value)} 
            required 
            className="form-input"
          />
        </div>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" className="signup-button">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUp;
