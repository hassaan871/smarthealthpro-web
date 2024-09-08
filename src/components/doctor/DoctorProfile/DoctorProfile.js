import React, { useState } from 'react';
import './DoctorProfile.css';

const DoctorProfile = () => {
    const [doctor, setDoctor] = useState({
        fullName: 'Dr. Alice Smith',
        specialization: 'Cardiologist',
        cnic: '35201-1234567-1',
        email: 'alice.smith@example.com',
        contactNumber: '123-456-7890',
        address: '123 Medical St, Lahore',
        about: 'Experienced cardiologist with 10+ years of experience.',
        clinicHours: {
            monday: { open: '09:00', close: '17:00' },
            tuesday: { open: '09:00', close: '17:00' },
            wednesday: { open: '09:00', close: '17:00' },
            thursday: { open: '09:00', close: '17:00' },
            friday: { open: '09:00', close: '17:00' },
            saturday: { open: '09:00', close: '14:00' },
            sunday: { open: '', close: '' },
        },
        profileImage: 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDoctor(prevDoctor => ({
            ...prevDoctor,
            [name]: value
        }));
    };

    const handleClinicHoursChange = (day, type, value) => {
        setDoctor(prevDoctor => ({
            ...prevDoctor,
            clinicHours: {
                ...prevDoctor.clinicHours,
                [day]: { ...prevDoctor.clinicHours[day], [type]: value }
            }
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setDoctor(prevDoctor => ({
                    ...prevDoctor,
                    profileImage: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logic for submitting updated profile details goes here
        console.log('Updated Profile:', doctor);
    };

    return (
        <div className="DoctorProfile-container">
            <div className="DoctorProfile-details-view">
                <img src={doctor.profileImage} alt={doctor.fullName} className="DoctorProfile-avatar" />
                <h2 className="DoctorProfile-name">{doctor.fullName}</h2>
                <p className="DoctorProfile-specialization"><strong>Specialization:</strong> {doctor.specialization}</p>
                <p className="DoctorProfile-email"><strong>Email:</strong> {doctor.email}</p>
                <p className="DoctorProfile-contactNumber"><strong>Contact Number:</strong> {doctor.contactNumber}</p>
                <p className="DoctorProfile-cnic"><strong>CNIC:</strong> {doctor.cnic}</p>
                <p className="DoctorProfile-address"><strong>Address:</strong> {doctor.address}</p>
                <p className="DoctorProfile-about"><strong>About:</strong> {doctor.about}</p>
                <div className="DoctorProfile-clinicHours">
                    <strong>Clinic Hours:</strong>
                    {Object.entries(doctor.clinicHours).map(([day, hours]) => (
                        <p key={day}>
                            <strong>{day.charAt(0).toUpperCase() + day.slice(1)}:</strong> {hours.open} - {hours.close}
                        </p>
                    ))}
                </div>
            </div>
            <div className="DoctorProfile-details-edit">
                <h2 className="DoctorProfile-header">Edit Profile</h2>
                <form onSubmit={handleSubmit}>
                    <div className="DoctorProfile-form-group">
                        <label>Full Name:</label>
                        <input 
                            type="text" 
                            name="fullName" 
                            value={doctor.fullName} 
                            onChange={handleInputChange} 
                            className="DoctorProfile-form-input" 
                        />
                    </div>
                    <div className="DoctorProfile-form-group">
                        <label>Specialization:</label>
                        <input 
                            type="text" 
                            name="specialization" 
                            value={doctor.specialization} 
                            onChange={handleInputChange} 
                            className="DoctorProfile-form-input" 
                        />
                    </div>
                    <div className="DoctorProfile-form-group">
                        <label>Email:</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={doctor.email} 
                            onChange={handleInputChange} 
                            className="DoctorProfile-form-input" 
                        />
                    </div>
                    <div className="DoctorProfile-form-group">
                        <label>Contact Number:</label>
                        <input 
                            type="text" 
                            name="contactNumber" 
                            value={doctor.contactNumber} 
                            onChange={handleInputChange} 
                            className="DoctorProfile-form-input" 
                        />
                    </div>
                    <div className="DoctorProfile-form-group">
                        <label>CNIC:</label>
                        <input 
                            type="text" 
                            name="cnic" 
                            value={doctor.cnic} 
                            onChange={handleInputChange} 
                            className="DoctorProfile-form-input" 
                        />
                    </div>
                    <div className="DoctorProfile-form-group">
                        <label>Address:</label>
                        <input 
                            type="text" 
                            name="address" 
                            value={doctor.address} 
                            onChange={handleInputChange} 
                            className="DoctorProfile-form-input" 
                        />
                    </div>
                    <div className="DoctorProfile-form-group">
                        <label>About:</label>
                        <textarea 
                            name="about" 
                            value={doctor.about} 
                            onChange={handleInputChange} 
                            className="DoctorProfile-form-input"
                        />
                    </div>
                    <div className="DoctorProfile-form-group">
                        <label>Profile Picture:</label>
                        <input 
                            type="file" 
                            onChange={handleImageChange} 
                            className="DoctorProfile-form-input" 
                        />
                    </div>
                    <div className="DoctorProfile-form-group">
                        <label>Clinic Hours:</label>
                        {Object.entries(doctor.clinicHours).map(([day, hours]) => (
                            <div key={day} className="DoctorProfile-clinicHours-entry">
                                <label>{day.charAt(0).toUpperCase() + day.slice(1)}:</label>
                                <input 
                                    type="time" 
                                    name={`${day}_open`} 
                                    value={hours.open} 
                                    onChange={(e) => handleClinicHoursChange(day, 'open', e.target.value)}
                                    className="DoctorProfile-form-input" 
                                />
                                <input 
                                    type="time" 
                                    name={`${day}_close`} 
                                    value={hours.close} 
                                    onChange={(e) => handleClinicHoursChange(day, 'close', e.target.value)}
                                    className="DoctorProfile-form-input" 
                                />
                            </div>
                        ))}
                    </div>
                    <button type="submit" className="DoctorProfile-submit-button">Save Changes</button>
                </form>
            </div>
        </div>
    );
};

export default DoctorProfile;
