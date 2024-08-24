import "./UserProfileCompletion.css";import React, { useState } from 'react';

// Define the UserProfileCompletion component
const UserProfileCompletion = () => {
  // State variables for form inputs
  const [user, setUser] = useState({
    userId: '66c0b2aa90040b7bc334b842',  // Sample user ID
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
    degreeFiles: [], // For storing uploaded PDF files
    profileImage: null // For storing the uploaded profile image
  });

  // Handler for input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // Handler for office hours input change
  const handleOfficeHoursChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, officeHours: { ...user.officeHours, [name]: value } });
  };

  // Handler for education input change
  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedEducation = [...user.education];
    updatedEducation[index][name] = value;
    setUser({ ...user, education: updatedEducation });
  };

  // Handler for adding more education fields
  const addEducationField = () => {
    setUser({
      ...user,
      education: [...user.education, { degree: '', institution: '', year: '' }],
    });
  };

  // Handler for removing an education field
  const removeEducationField = (index) => {
    const updatedEducation = [...user.education];
    updatedEducation.splice(index, 1);
    setUser({ ...user, education: updatedEducation });
  };

  // Handler for PDF file upload
  const handleFileChange = (e) => {
    setUser({ ...user, degreeFiles: e.target.files });
  };

  // Handler for image file upload
  const handleImageChange = (e) => {
    setUser({ ...user, profileImage: e.target.files[0] });
  };

  // Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert the form data into a FormData object for sending to the server
    const formData = new FormData();
    formData.append('userId', user.userId);
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

    // TODO: Send formData to the server using fetch or axios
    console.log('Form submitted', formData);
  };

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
          />
        </div>

        <div className="form-group">
          <label>About:</label>
          <textarea
            name="about"
            value={user.about}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <h3>Office Hours</h3>
          {Object.keys(user.officeHours).map((day) => (
            <div key={day}>
              <label>{day.charAt(0).toUpperCase() + day.slice(1)}:</label>
              <input
                type="text"
                name={day}
                value={user.officeHours[day]}
                onChange={handleOfficeHoursChange}
                required
              />
            </div>
          ))}
        </div>

        <div className="form-group">
          <h3>Education</h3>
          {user.education.map((edu, index) => (
            <div key={index} className="education-item">
              <input
                type="text"
                name="degree"
                placeholder="Degree"
                value={edu.degree}
                onChange={(e) => handleEducationChange(index, e)}
                required
              />
              <input
                type="text"
                name="institution"
                placeholder="Institution"
                value={edu.institution}
                onChange={(e) => handleEducationChange(index, e)}
                required
              />
              <input
                type="text"
                name="year"
                placeholder="Year"
                value={edu.year}
                onChange={(e) => handleEducationChange(index, e)}
                required
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeEducationField(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addEducationField}>
            Add More
          </button>
        </div>

        <div className="form-group">
          <label>Upload Degrees (PDF only):</label>
          <input
            type="file"
            accept=".pdf"
            multiple
            onChange={handleFileChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Upload Profile Image (JPG, PNG):</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default UserProfileCompletion;
