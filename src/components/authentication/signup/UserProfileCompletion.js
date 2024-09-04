// src/components/authentication/signup/UserProfileCompletion.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../axiosInstance';
import "./UserProfileCompletion.css";

const UserProfileCompletion = () => {
  const [user, setUser] = useState({
    specialization: '',
    cnic: '',
    address: '',
    about: '',
    officeHours: {
      monday: '',
      tuesday: '',
      wednesday: '',
      thursday: '',
      friday: '',
      saturday: '',
      sunday: '',
    },
    education: [{ degree: '', institution: '', year: '' }],
    degreeFiles: [],
    profileImage: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleOfficeHoursChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, officeHours: { ...user.officeHours, [name]: value } });
  };

  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedEducation = [...user.education];
    updatedEducation[index][name] = value;
    setUser({ ...user, education: updatedEducation });
  };

  const addEducationField = () => {
    setUser({
      ...user,
      education: [...user.education, { degree: '', institution: '', year: '' }],
    });
  };

  const removeEducationField = (index) => {
    const updatedEducation = [...user.education];
    updatedEducation.splice(index, 1);
    setUser({ ...user, education: updatedEducation });
  };

  const handleFileChange = (e) => {
    setUser({ ...user, degreeFiles: e.target.files });
  };

  const handleImageChange = (e) => {
    setUser({ ...user, profileImage: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('specialization', user.specialization);
    formData.append('cnic', user.cnic);
    formData.append('address', user.address);
    formData.append('about', user.about);
    for (let [key, value] of Object.entries(user.officeHours)) {
      formData.append(`officeHours[${key}]`, value);
    }
    user.education.forEach((edu, index) => {
      formData.append(`education[${index}][degree]`, edu.degree);
      formData.append(`education[${index}][institution]`, edu.institution);
      formData.append(`education[${index}][year]`, edu.year);
    });
    Array.from(user.degreeFiles).forEach((file) => {
      formData.append('degreeFiles', file);
    });

    if (user.profileImage) {
      formData.append('profileImage', user.profileImage);
    }

    try {
      await axiosInstance.post('/auth/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      window.location.href = '/dashboard'; // Redirect to dashboard after profile completion
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // Fetch existing profile data if needed
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get('/auth/profile');
        setUser(response.data);
      } catch (err) {
        console.error('Failed to fetch profile data');
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="user-profile-completion">
      <h2>Complete Your Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Specialization:</label>
          <input 
            type="text" 
            name="specialization"
            value={user.specialization} 
            onChange={handleInputChange} 
            required 
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>CNIC:</label>
          <input 
            type="text" 
            name="cnic"
            value={user.cnic} 
            onChange={handleInputChange} 
            required 
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Address:</label>
          <input 
            type="text" 
            name="address"
            value={user.address} 
            onChange={handleInputChange} 
            required 
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>About:</label>
          <textarea 
            name="about"
            value={user.about} 
            onChange={handleInputChange} 
            required 
            className="form-input"
          ></textarea>
        </div>
        <div className="form-group">
          <label>Office Hours:</label>
          <input 
            type="text" 
            name="monday"
            value={user.officeHours.monday} 
            onChange={handleOfficeHoursChange} 
            placeholder="Monday" 
            className="form-input"
          />
          {/* Add more days similarly */}
        </div>
        <div className="form-group">
          <label>Education:</label>
          {user.education.map((edu, index) => (
            <div key={index} className="education-entry">
              <input 
                type="text" 
                name="degree"
                value={edu.degree} 
                onChange={(e) => handleEducationChange(index, e)} 
                placeholder="Degree" 
                required 
                className="form-input"
              />
              <input 
                type="text" 
                name="institution"
                value={edu.institution} 
                onChange={(e) => handleEducationChange(index, e)} 
                placeholder="Institution" 
                required 
                className="form-input"
              />
              <input 
                type="text" 
                name="year"
                value={edu.year} 
                onChange={(e) => handleEducationChange(index, e)} 
                placeholder="Year" 
                required 
                className="form-input"
              />
              <button type="button" onClick={() => removeEducationField(index)}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={addEducationField}>Add Education</button>
        </div>
        <div className="form-group">
          <label>Upload Degrees:</label>
          <input 
            type="file" 
            multiple 
            onChange={handleFileChange} 
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Profile Image:</label>
          <input 
            type="file" 
            onChange={handleImageChange} 
            className="form-input"
          />
        </div>
        <button type="submit" className="submit-button">Complete Profile</button>
      </form>
    </div>
  );
};

export default UserProfileCompletion;
