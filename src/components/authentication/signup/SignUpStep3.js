import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignUpStep3() {
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handleCompleteRegistration = async (event) => {
    event.preventDefault();

    const basicData = JSON.parse(localStorage.getItem('basicData'));
    const additionalData = JSON.parse(localStorage.getItem('additionalData'));

    // Create a FormData object to handle the image and other data
    const formData = new FormData();
    formData.append('avatar', image);
    
    // Append all basicData and additionalData fields to FormData
    for (const key in basicData) {
      formData.append(key, basicData[key]);
    }
    for (const key in additionalData) {
      formData.append(key, additionalData[key]);
    }

    try {
      const response = await axios.post('http://localhost:5000/user/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Response from API:', response.data);

      // Navigate to profile completion page after successful registration
      if (response.status === 200) {
        navigate('/profile-completion');
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
          <h2 className="text-center mb-4">Upload Profile Picture</h2>
          <form onSubmit={handleCompleteRegistration} className="w-100">
            {/* Image Upload */}
            <div className="form-group mb-3">
              <input 
                type="file" 
                className="form-control" 
                onChange={handleImageUpload} 
                accept="image/*"
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">Complete Registration</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUpStep3;
