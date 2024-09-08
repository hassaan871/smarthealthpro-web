import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../axiosInstance';
import "./UserProfileCompletion.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faAddressCard, faClock, faGraduationCap, faUpload } from '@fortawesome/free-solid-svg-icons';

const UserProfileCompletion = () => {
  const [user, setUser] = useState({
    specialization: '',
    cnic: '',
    address: '',
    about: '',
    officeHours: {
      monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: ''
    },
    education: [{ degree: '', institution: '', year: '' }],
    degreeFiles: [],
    profileImage: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({ ...prevUser, [name]: value }));
  };

  const handleOfficeHoursChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({
      ...prevUser,
      officeHours: { ...prevUser.officeHours, [name]: value }
    }));
  };

  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    setUser(prevUser => {
      const updatedEducation = [...prevUser.education];
      updatedEducation[index] = { ...updatedEducation[index], [name]: value };
      return { ...prevUser, education: updatedEducation };
    });
  };

  const addEducationField = () => {
    setUser(prevUser => ({
      ...prevUser,
      education: [...prevUser.education, { degree: '', institution: '', year: '' }]
    }));
  };

  const removeEducationField = (index) => {
    setUser(prevUser => ({
      ...prevUser,
      education: prevUser.education.filter((_, i) => i !== index)
    }));
  };

  const handleFileChange = (e) => {
    setUser(prevUser => ({ ...prevUser, degreeFiles: Array.from(e.target.files) }));
  };

  const handleImageChange = (e) => {
    setUser(prevUser => ({ ...prevUser, profileImage: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    Object.keys(user).forEach(key => {
      if (key === 'officeHours') {
        Object.entries(user.officeHours).forEach(([day, hours]) => {
          formData.append(`officeHours[${day}]`, hours);
        });
      } else if (key === 'education') {
        user.education.forEach((edu, index) => {
          Object.entries(edu).forEach(([field, value]) => {
            formData.append(`education[${index}][${field}]`, value);
          });
        });
      } else if (key === 'degreeFiles') {
        user.degreeFiles.forEach(file => {
          formData.append('degreeFiles', file);
        });
      } else if (key === 'profileImage' && user.profileImage) {
        formData.append('profileImage', user.profileImage);
      } else {
        formData.append(key, user[key]);
      }
    });

    try {
      await axiosInstance.post('/auth/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Error submitting profile:', err);
      // Add error handling here (e.g., display error message to user)
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get('/auth/profile');
        setUser(prevUser => ({ ...prevUser, ...response.data }));
      } catch (err) {
        console.error('Failed to fetch profile data:', err);
        // Add error handling here (e.g., display error message to user)
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="profile-completionscreen-container">
      <h2 className="profile-completionscreen-header">Complete Your Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="profile-completionscreen-form-group">
          <label><FontAwesomeIcon icon={faUser} className="fa-icon" />Specialization:</label>
          <input 
            type="text" 
            name="specialization"
            value={user.specialization} 
            onChange={handleInputChange} 
            required 
            className="profile-completionscreen-form-input"
          />
        </div>
        <div className="profile-completionscreen-form-group">
          <label><FontAwesomeIcon icon={faAddressCard} className="fa-icon" />CNIC:</label>
          <input 
            type="text" 
            name="cnic"
            value={user.cnic} 
            onChange={handleInputChange} 
            required 
            className="profile-completionscreen-form-input"
          />
        </div>
        <div className="profile-completionscreen-form-group">
          <label><FontAwesomeIcon icon={faAddressCard} className="fa-icon" />Address:</label>
          <input 
            type="text" 
            name="address"
            value={user.address} 
            onChange={handleInputChange} 
            required 
            className="profile-completionscreen-form-input"
          />
        </div>
        <div className="profile-completionscreen-form-group">
          <label><FontAwesomeIcon icon={faUser} className="fa-icon" />About:</label>
          <textarea 
            name="about"
            value={user.about} 
            onChange={handleInputChange} 
            required 
            className="profile-completionscreen-form-input"
          ></textarea>
        </div>
        <div className="profile-completionscreen-form-group">
          <label><FontAwesomeIcon icon={faClock} className="fa-icon" />Office Hours:</label>
          {Object.entries(user.officeHours).map(([day, hours]) => (
            <input 
              key={day}
              type="text" 
              name={day}
              value={hours} 
              onChange={handleOfficeHoursChange} 
              placeholder={day.charAt(0).toUpperCase() + day.slice(1)} 
              className="profile-completionscreen-form-input"
            />
          ))}
        </div>
        <div className="profile-completionscreen-form-group">
          <label><FontAwesomeIcon icon={faGraduationCap} className="fa-icon" />Education:</label>
          {user.education.map((edu, index) => (
            <div key={index} className="profile-completionscreen-education-entry">
              <input 
                type="text" 
                name="degree"
                value={edu.degree} 
                onChange={(e) => handleEducationChange(index, e)} 
                placeholder="Degree" 
                required 
                className="profile-completionscreen-form-input"
              />
              <input 
                type="text" 
                name="institution"
                value={edu.institution} 
                onChange={(e) => handleEducationChange(index, e)} 
                placeholder="Institution" 
                required 
                className="profile-completionscreen-form-input"
              />
              <input 
                type="text" 
                name="year"
                value={edu.year} 
                onChange={(e) => handleEducationChange(index, e)} 
                placeholder="Year" 
                required 
                className="profile-completionscreen-form-input"
              />
              <button type="button" onClick={() => removeEducationField(index)} className="profile-completionscreen-button">Remove</button>
            </div>
          ))}
          <button type="button" onClick={addEducationField} className="profile-completionscreen-button">Add Education</button>
        </div>
        <div className="profile-completionscreen-form-group">
          <label><FontAwesomeIcon icon={faUpload} className="fa-icon" />Upload Degrees:</label>
          <input 
            type="file" 
            multiple 
            onChange={handleFileChange} 
            className="profile-completionscreen-form-input"
          />
        </div>
        <div className="profile-completionscreen-form-group">
          <label><FontAwesomeIcon icon={faUpload} className="fa-icon" />Profile Image:</label>
          <input 
            type="file" 
            onChange={handleImageChange} 
            className="profile-completionscreen-form-input"
          />
        </div>
        <button type="submit" className="profile-completionscreen-button">Complete Profile</button>
      </form>
    </div>
  );
};

export default UserProfileCompletion;