import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const auth = localStorage.getItem('user');
    if (auth) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();
    let result = await fetch('http://localhost:5000/user/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    result = await result.json();
    if (result.email) {
      localStorage.setItem('user', JSON.stringify(result));
      navigate('/dashboard');
    } else {
      alert('Please enter correct details');
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="row shadow-lg p-5 bg-white rounded w-100" style={{ maxWidth: '1200px' }}>
        {/* Info Section */}
        <div className="col-lg-6 d-none d-lg-block border-end">
          <h1 className="text-primary mb-4">SmartHealthPro</h1>
          <p className="text-muted">
            Welcome to SmartHealth Pro, Doctor!<br /><br />
            Your expertise meets innovation here at SmartHealth Pro. Our platform helps you manage patients with diabetes and hypertension efficiently, providing tools and insights needed for exceptional care.<br /><br />
            With AI-driven summaries, seamless scheduling, and real-time alerts, focus on what you do best—caring for patients. Our secure, user-friendly interface enhances your workflow and patient outcomes.<br /><br />
            Log in now and experience the future of healthcare. Together, let's make a difference, one patient at a time!
          </p>
        </div>

        {/* Login Section */}
        <div className="col-lg-6">
          <h2 className="text-primary text-center mb-4">Login</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email:</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password:</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-control"
              />
            </div>
            {error && <p className="text-danger">{error}</p>}
            <button type="submit" className="btn btn-primary w-100">Login</button>

            <div className="text-center mt-3">
              <a href="#" className="text-primary">Forgot Password?</a>
            </div>

            <div className="text-center my-3">
              <hr className="w-50 mx-auto" />
              <span>or</span>
              <hr className="w-50 mx-auto" />
            </div>

            <button type="button" className="btn btn-secondary w-100" onClick={() => window.location.href = '/signup'}>
              Sign up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
