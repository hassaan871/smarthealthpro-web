import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SignUp.css';

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle sign-up logic here
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Specialty:', specialty);
    console.log('Contact Number:', contactNumber);
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
        <button type="submit" className="signup-button">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUp;