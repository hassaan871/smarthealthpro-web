import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignUpStep3() {
  const navigate = useNavigate();

  const handleCompleteRegistration = async (event) => {
    event.preventDefault();

    // Get data from localStorage
    const basicData = JSON.parse(localStorage.getItem('basicData'));
    const additionalData = JSON.parse(localStorage.getItem('additionalData'));

    // Create an object to send as plain JSON
    const dataToUpload = {
      ...basicData,
      ...additionalData,
      role: "doctor"  
    };

    console.log('Data to upload:', dataToUpload);  // Log the data being sent

    try {
      // Make the POST request to the server with application/json content type
      const response = await axios.post('http://localhost:5000/user/register', dataToUpload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response from API:', response.data);  // Log the API response data

      // Navigate to login if registration is successful
    if (response.status === 200 || response.status === 201) {
        console.log('Registration successful, navigating to login page');
        navigate('/login');
      } else {
        console.error('Registration failed:', response.data);
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="row w-100">
        <div className="col-md-6 d-flex flex-column justify-content-center p-4">
          <h2 className="text-center mb-4">Complete Registration</h2>
          <form onSubmit={handleCompleteRegistration} className="w-100">
            {/* Removed image upload functionality */}

            <button type="submit" className="btn btn-primary w-100">Done</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUpStep3;
