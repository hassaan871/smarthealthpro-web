import React, { useState } from 'react';
import './DoctorDetailEdit.css';

const DoctorDetailEdit = () => {
  // Dummy data
  const doctor = {
    id: "66c0b2aa90040b7bc334b842",
    name: "Dr. Alice Smith",
    avatar: "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-png.png",
    specialization: "Cardiologist",
    location: "Wilshire Medical Center, Lahore",
    description: "Routine check-up.",
    selectedTimeSlot: "09:00 AM",
    availableTimeSlots: ["09:00 AM", "10:00 AM", "11:00 AM"]
  };

  const [formData, setFormData] = useState({
    name: doctor.name,
    specialization: doctor.specialization,
    location: doctor.location,
    description: doctor.description,
    selectedTimeSlot: doctor.selectedTimeSlot,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveClick = () => {
    console.log('Save clicked with data:', formData);
  };

  const handleCancelClick = () => {
    console.log('Cancel clicked');
  };

  return (
    <div className="edit-doctor-container">
      <h2>Edit Doctor Details</h2>
      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Specialization</label>
        <input
          type="text"
          name="specialization"
          value={formData.specialization}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Selected Time Slot</label>
        <select
          name="selectedTimeSlot"
          value={formData.selectedTimeSlot}
          onChange={handleInputChange}
        >
          {doctor.availableTimeSlots.map((slot, index) => (
            <option key={index} value={slot}>
              {slot}
            </option>
          ))}
        </select>
      </div>
      <div className="button-group">
        <button className="save-button" onClick={handleSaveClick}>
          Save
        </button>
        <button className="cancel-button" onClick={handleCancelClick}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DoctorDetailEdit;
