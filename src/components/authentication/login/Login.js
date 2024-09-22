import React, { useEffect, useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  useEffect(()=>{
    const auth = localStorage.getItem('user');
    if(auth){
      navigate("/dashboard");
    }
  },[])

  const handleLogin = async (event) => {
    event.preventDefault();
    console.warn("email, password", email, password);
    let result = await fetch('http://localhost:5000/user/login',{
      method: 'POST',
      body: JSON.stringify({email, password}),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    result = await result.json();
    console.warn(result);
    if(result.email){
      localStorage.setItem("user", JSON.stringify(result));
      navigate("/dashboard");
    }else{
      alert('Please enter correct details')
    }
    
  };

  return (
    <div className="loginpage-wrapper">
      <div className="loginpage-info-section">
        <h1 className="loginpage-app-title">SmartHealthPro</h1>
        <p className="loginpage-welcome-text">
          Welcome to SmartHealth Pro, Doctor!<br /><br />
          Your expertise meets innovation here at SmartHealth Pro. Our platform helps you manage patients with diabetes and hypertension efficiently, providing tools and insights needed for exceptional care.<br /><br />
          With AI-driven summaries, seamless scheduling, and real-time alerts, focus on what you do best—caring for patients. Our secure, user-friendly interface enhances your workflow and patient outcomes.<br /><br />
          Log in now and experience the future of healthcare. Together, let's make a difference, one patient at a time!
        </p>
      </div>
      <div className="loginpage-login-section">
        <h2 className="loginpage-login-title">Login</h2>
        <form onSubmit={handleLogin} className="loginpage-login-form">
          <div className="loginpage-form-group">
            <label htmlFor="email">Email:</label>
            <input 
              id="email"
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="loginpage-form-input"
            />
          </div>
          <div className="loginpage-form-group">
            <label htmlFor="password">Password:</label>
            <input 
              id="password"
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="loginpage-form-input"
            />
          </div>
          {error && <p className="loginpage-error-text">{error}</p>}
          <button type="submit" className="loginpage-login-button">Login</button>
          <div className="loginpage-extra-options">
            <a href="#" className="loginpage-forgot-password">Forgot Password?</a>
          </div>
          <div className="loginpage-divider">
            <hr />
            <span>or</span>
          </div>
          <button type="button" className="loginpage-signup-button" onClick={() => window.location.href = '/signup'}>Sign up</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
