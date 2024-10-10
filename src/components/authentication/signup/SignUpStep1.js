import React, { useState } from 'react';
import { User, Mail, Lock, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function SignUpStep1() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // const [gender, setGender] = useState('');
  // const [contactNumber, setContactNumber] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleNextStep = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError('Password and confirm password do not match');
      return;
    }

    // Clear error and save the basic data
    setError('');
    const basicData = { name, email, password};
    localStorage.setItem('basicData', JSON.stringify(basicData));

    // Navigate to the next step
    navigate('/SignUpStep2');
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="row w-100">
        {/* Left Side - Welcome Message */}
        <div className="col-md-6 d-none d-md-flex flex-column justify-content-center align-items-center bg-primary text-white text-center">
          <h2>Welcome Back!</h2>
          <p>
            Welcome, Doctor! To stay connected and manage your appointments with ease, 
            please log in using your personal information. Smart Health Pro offers secure 
            access to patient records and a seamless online booking experience.
          </p>
        </div>

        {/* Right Side - SignUp Form */}
        <div className="col-md-6 d-flex flex-column justify-content-center p-4">
          <h2 className="text-center mb-4">Create Account</h2>
          <form onSubmit={handleNextStep} className="w-100">
            {/* Name Field */}
            <div className="form-group mb-3 position-relative">
              <input 
                type="text" 
                className="form-control" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Name" 
                required 
              />
              <User className="position-absolute top-50 end-0 translate-middle-y me-2" size={20} />
            </div>

            {/* Email Field */}
            <div className="form-group mb-3 position-relative">
              <input 
                type="email" 
                className="form-control" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Email" 
                required 
              />
              <Mail className="position-absolute top-50 end-0 translate-middle-y me-2" size={20} />
            </div>

            {/* Password Field */}
            <div className="form-group mb-3 position-relative">
              <input 
                type="password" 
                className="form-control" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Password" 
                required 
              />
              <Lock className="position-absolute top-50 end-0 translate-middle-y me-2" size={20} />
            </div>

            {/* Confirm Password Field */}
            <div className="form-group mb-3 position-relative">
              <input 
                type="password" 
                className="form-control" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                placeholder="Confirm Password" 
                required 
              />
              <Lock className="position-absolute top-50 end-0 translate-middle-y me-2" size={20} />
            </div>
{/* 
            <div className="form-group mb-3">
              <select 
                className="form-select" 
                value={gender} 
                onChange={(e) => setGender(e.target.value)} 
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div> */}

            {/* Contact Number Field */}
            {/* <div className="form-group mb-3 position-relative">
              <input 
                type="tel" 
                className="form-control" 
                value={contactNumber} 
                onChange={(e) => setContactNumber(e.target.value)} 
                placeholder="Contact Number" 
                required 
              />
              <Phone className="position-absolute top-50 end-0 translate-middle-y me-2" size={20} />
            </div> */}

            {error && <p className="text-danger text-center">{error}</p>}

            {/* Continue Button */}
            <button type="submit" className="btn btn-primary w-100">Continue</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUpStep1;
