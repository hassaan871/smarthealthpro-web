import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../axiosInstance';
import "./UserProfileCompletion.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faAddressCard, faClock, faGraduationCap, faUpload } from '@fortawesome/free-solid-svg-icons';

const UserProfileCompletion = () => {
  const [user, setUser] = useState({
    fullName: '',
    specialization: '',
    cnic: '',
    address: '',
    about: '',
    clinicHours: {
      monday: { open: '', close: '' },
      tuesday: { open: '', close: '' },
      wednesday: { open: '', close: '' },
      thursday: { open: '', close: '' },
      friday: { open: '', close: '' },
      saturday: { open: '', close: '' },
      sunday: { open: '', close: '' }
    },
    education: [{ degree: '', institution: '', startYear: '', endYear: '' }],
    degreeFiles: [],
    profileImage: null
  });

  const [previewImage, setPreviewImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({ ...prevUser, [name]: value }));
  };

  const handleClinicHoursChange = (day, type, value) => {
    setUser(prevUser => ({
      ...prevUser,
      clinicHours: {
        ...prevUser.clinicHours,
        [day]: { ...prevUser.clinicHours[day], [type]: value }
      }
    }));
  };

  const handleEducationChange = (index, field, value) => {
    setUser(prevUser => {
      const updatedEducation = [...prevUser.education];
      updatedEducation[index] = { ...updatedEducation[index], [field]: value };
      return { ...prevUser, education: updatedEducation };
    });
  };

  const addEducationField = () => {
    setUser(prevUser => ({
      ...prevUser,
      education: [...prevUser.education, { degree: '', institution: '', startYear: '', endYear: '' }]
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
    const file = e.target.files[0];
    setUser(prevUser => ({ ...prevUser, profileImage: file }));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    Object.keys(user).forEach(key => {
      if (key === 'clinicHours') {
        Object.entries(user.clinicHours).forEach(([day, hours]) => {
          formData.append(`clinicHours[${day}][open]`, hours.open);
          formData.append(`clinicHours[${day}][close]`, hours.close);
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
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get('/auth/profile');
        setUser(prevUser => ({ ...prevUser, ...response.data }));
      } catch (err) {
        console.error('Failed to fetch profile data:', err);
      }
    };

    fetchProfile();
  }, []);

  // const generateYearOptions = () => {
  //   const currentYear = new Date().getFullYear();
  //   const years = [];
  //   for (let year = currentYear; year >= currentYear -

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= currentYear - 50; year--) {
      years.push(
        <option key={year} value={year}>
          {year}
        </option>
      );
    }
    return years;
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      const timeLabel = hour < 10 ? `0${hour}:00` : `${hour}:00`;
      times.push(
        <option key={hour} value={timeLabel}>
          {timeLabel}
        </option>
      );
    }
    return times;
  };

  const handleCnicChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cnic') {
      // Limit CNIC input to 13 digits
      setUser(prevUser => ({ ...prevUser, [name]: value.slice(0, 13).replace(/\D/g, '') }));
    } else {
      setUser(prevUser => ({ ...prevUser, [name]: value }));
    }
  };

  return (
    <div className="profile-completionscreen-container">
      <h2 className="profile-completionscreen-header">Complete Your Profile</h2>
      <form onSubmit={handleSubmit}>

      <div className="profile-picture-container">
          {previewImage ? (
            <img 
              src={previewImage} 
              alt="Profile Preview" 
              className="profile-picture-preview"
            />
          ) : (
            <FontAwesomeIcon icon={faUser} className="profile-picture-placeholder" />
          )}
          <label htmlFor="profileImage" className="profile-picture-label">Choose Profile Picture</label>
          <input 
            type="file" 
            id="profileImage" 
            onChange={handleImageChange} 
            className="profile-picture-input"
          />
        </div>
        
        <div className="profile-completionscreen-form-group">
          <label><FontAwesomeIcon icon={faUser} className="fa-icon" />Full Name:</label>
          <input 
            type="text" 
            name="fullName"
            value={user.fullName} 
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
            pattern="[0-9]{13}"
            title="Please enter a valid 13-digit CNIC number"
          />
        </div>
        
        
        
        <div className="profile-completionscreen-form-group">
          <label><FontAwesomeIcon icon={faGraduationCap} className="fa-icon" />Education:</label>
          {user.education.map((edu, index) => (
            <div key={index} className="profile-completionscreen-education-entry">
              <input 
                type="text" 
                name="degree"
                value={edu.degree} 
                onChange={(e) => handleEducationChange(index, 'degree', e.target.value)} 
                placeholder="Degree" 
                required 
                className="profile-completionscreen-form-input"
              />
              <input 
                type="text" 
                name="institution"
                value={edu.institution} 
                onChange={(e) => handleEducationChange(index, 'institution', e.target.value)} 
                placeholder="Institution" 
                required 
                className="profile-completionscreen-form-input"
              />
              <select
                value={edu.startYear}
                onChange={(e) => handleEducationChange(index, 'startYear', e.target.value)}
                required
              >
                <option value="">Start Year</option>
                {generateYearOptions()}
              </select>
              <select
                value={edu.endYear}
                onChange={(e) => handleEducationChange(index, 'endYear', e.target.value)}
                required
                disabled={!edu.startYear}
              >
                <option value="">End Year</option>
                {generateYearOptions()}
              </select>
              <button type="button" onClick={() => removeEducationField(index)} className="profile-completionscreen-button">Remove</button>
            </div>
          ))}
          <button type="button" onClick={addEducationField} className="profile-completionscreen-button">Add Education</button>
        </div>
        
        <div className="profile-completionscreen-form-group">
          <label><FontAwesomeIcon icon={faUpload} className="fa-icon" />Upload Degrees:</label>
          <div className="degree-upload-container">
            <input 
              type="file" 
              multiple 
              onChange={handleFileChange} 
              className="degree-upload-input"
            />
            <span>Drag and drop or click to upload files</span>
          </div>
        </div>
        
        <div className="profile-completionscreen-form-group">
          <label><FontAwesomeIcon icon={faClock} className="fa-icon" />Clinic Hours:</label>
          {Object.entries(user.clinicHours).map(([day, hours]) => (
            <div key={day} className="clinic-hours-entry">
              <label>{day.charAt(0).toUpperCase() + day.slice(1)}:</label>
              <select
                value={hours.open}
                onChange={(e) => handleClinicHoursChange(day, 'open', e.target.value)}
                className="clinic-hours-select"
              >
                {/* <option value="">Open</ */}
                <option value="">Open</option>
                  {generateTimeOptions()}
                </select>
                <select
                  value={hours.close}
                  onChange={(e) => handleClinicHoursChange(day, 'close', e.target.value)}
                  className="clinic-hours-select"
                >
                  <option value="">Close</option>
                  {generateTimeOptions()}
                </select>
              </div>
            ))}
          </div>

          <button type="submit" className="profile-completionscreen-submit-button">Save Profile</button>
        </form>
      </div>
    );
  };

  export default UserProfileCompletion;