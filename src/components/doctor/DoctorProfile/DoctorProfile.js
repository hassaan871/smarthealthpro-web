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
            monday: { status: 'open', open: '09:00', close: '17:00' },
            tuesday: { status: 'open', open: '09:00', close: '17:00' },
            wednesday: { status: 'open', open: '09:00', close: '17:00' },
            thursday: { status: 'open', open: '09:00', close: '17:00' },
            friday: { status: 'open', open: '09:00', close: '17:00' },
            saturday: { status: 'open', open: '09:00', close: '14:00' },
            sunday: { status: 'closed', open: '', close: '' },
        },
        profileImage: 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png',
    });

    const [errors, setErrors] = useState({});

    const validateField = (name, value) => {
        switch (name) {
            case 'fullName':
                return value.length < 3 ? 'Full name must be at least 3 characters long' : '';
            case 'email':
                return !/\S+@\S+\.\S+/.test(value) ? 'Email address is invalid' : '';
            case 'contactNumber':
                return !/^\d{11}$/.test(value) ? 'Contact number must be 11 digits' : '';
            case 'cnic':
                return !/^\d{5}-\d{7}-\d$/.test(value) ? 'CNIC must be in the format xxxxx-xxxxxxx-x' : '';
            default:
                return '';
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDoctor(prevDoctor => ({
            ...prevDoctor,
            [name]: value
        }));

        const error = validateField(name, value);
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: error
        }));
    };

    const handleClinicHoursChange = (day, type, value) => {
        setDoctor(prevDoctor => ({
            ...prevDoctor,
            clinicHours: {
                ...prevDoctor.clinicHours,
                [day]: { 
                    ...prevDoctor.clinicHours[day], 
                    [type]: value,
                    status: type === 'status' ? value : prevDoctor.clinicHours[day].status
                }
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
        const newErrors = {};
        Object.keys(doctor).forEach(key => {
            if (typeof doctor[key] === 'string') {
                const error = validateField(key, doctor[key]);
                if (error) newErrors[key] = error;
            }
        });

        if (Object.keys(newErrors).length === 0) {
            console.log('Form submitted:', doctor);
            // Here you would typically send the data to a server
        } else {
            setErrors(newErrors);
        }
    };

    return (
        <div className="DoctorProfile-container">
            <div className="DoctorProfile-view">
                <h2 className="DoctorProfile-header">Doctor Profile</h2>
                <img src={doctor.profileImage} alt={doctor.fullName} className="DoctorProfile-avatar" />
                <h2 className="DoctorProfile-name">{doctor.fullName}</h2>
                <p className="DoctorProfile-detail"><strong>Specialization:</strong> {doctor.specialization}</p>
                <p className="DoctorProfile-detail"><strong>Email:</strong> {doctor.email}</p>
                <p className="DoctorProfile-detail"><strong>Contact Number:</strong> {doctor.contactNumber}</p>
                <p className="DoctorProfile-detail"><strong>CNIC:</strong> {doctor.cnic}</p>
                <p className="DoctorProfile-detail"><strong>Address:</strong> {doctor.address}</p>
                <p className="DoctorProfile-detail"><strong>About:</strong> {doctor.about}</p>
                <div className="DoctorProfile-clinicHours">
                    <strong>Clinic Hours:</strong>
                    {Object.entries(doctor.clinicHours).map(([day, hours]) => (
                        <p key={day} className="DoctorProfile-detail">
                            <strong>{day.charAt(0).toUpperCase() + day.slice(1)}:</strong> 
                            {hours.status === 'closed' ? 'Closed' : `${hours.open} - ${hours.close}`}
                        </p>
                    ))}
                </div>
            </div>
            <div className="DoctorProfile-edit">
                <h2 className="DoctorProfile-header">Edit Profile</h2>
                <form onSubmit={handleSubmit} className="DoctorProfile-form">
                    <div className="DoctorProfile-form-group">
                        <label htmlFor="fullName">Full Name:</label>
                        <input 
                            id="fullName"
                            type="text" 
                            name="fullName" 
                            value={doctor.fullName} 
                            onChange={handleInputChange} 
                            className={`DoctorProfile-form-input ${errors.fullName ? 'error' : ''}`}
                            required 
                        />
                        {errors.fullName && <span className="DoctorProfile-error-message">{errors.fullName}</span>}
                    </div>
                    <div className="DoctorProfile-form-group">
                        <label htmlFor="specialization">Specialization:</label>
                        <input 
                            id="specialization"
                            type="text" 
                            name="specialization" 
                            value={doctor.specialization} 
                            onChange={handleInputChange} 
                            className="DoctorProfile-form-input" 
                            required
                        />
                    </div>
                    <div className="DoctorProfile-form-group">
                        <label htmlFor="email">Email:</label>
                        <input 
                            id="email"
                            type="email" 
                            name="email" 
                            value={doctor.email} 
                            onChange={handleInputChange} 
                            className={`DoctorProfile-form-input ${errors.email ? 'error' : ''}`}
                            required 
                        />
                        {errors.email && <span className="DoctorProfile-error-message">{errors.email}</span>}
                    </div>
                    <div className="DoctorProfile-form-group">
                        <label htmlFor="contactNumber">Contact Number:</label>
                        <input 
                            id="contactNumber"
                            type="tel" 
                            name="contactNumber" 
                            value={doctor.contactNumber} 
                            onChange={handleInputChange} 
                            className={`DoctorProfile-form-input ${errors.contactNumber ? 'error' : ''}`}
                            required 
                        />
                        {errors.contactNumber && <span className="DoctorProfile-error-message">{errors.contactNumber}</span>}
                    </div>
                    <div className="DoctorProfile-form-group">
                        <label htmlFor="cnic">CNIC:</label>
                        <input 
                            id="cnic"
                            type="text" 
                            name="cnic" 
                            value={doctor.cnic} 
                            onChange={handleInputChange} 
                            className={`DoctorProfile-form-input ${errors.cnic ? 'error' : ''}`}
                            required 
                        />
                        {errors.cnic && <span className="DoctorProfile-error-message">{errors.cnic}</span>}
                    </div>
                    <div className="DoctorProfile-form-group">
                        <label htmlFor="address">Address:</label>
                        <textarea 
                            id="address"
                            name="address" 
                            value={doctor.address} 
                            onChange={handleInputChange} 
                            className="DoctorProfile-form-input"
                            required
                        />
                    </div>
                    <div className="DoctorProfile-form-group">
                        <label htmlFor="about">About:</label>
                        <textarea 
                            id="about"
                            name="about" 
                            value={doctor.about} 
                            onChange={handleInputChange} 
                            className="DoctorProfile-form-input"
                        />
                    </div>
                    <div className="DoctorProfile-form-group">
                        <label htmlFor="profileImage">Profile Picture:</label>
                        <input 
                            id="profileImage"
                            type="file" 
                            onChange={handleImageChange} 
                            className="DoctorProfile-form-input" 
                            accept="image/*"
                        />
                    </div>
                    <div className="DoctorProfile-form-group">
                        <label>Clinic Hours:</label>
                        <div className="DoctorProfile-clinicHours-edit">
                            {Object.entries(doctor.clinicHours).map(([day, hours]) => (
                                <div key={day} className="DoctorProfile-clinicHours-entry">
                                    <label>{day.charAt(0).toUpperCase() + day.slice(1)}:</label>
                                    <select
                                        value={hours.status}
                                        onChange={(e) => handleClinicHoursChange(day, 'status', e.target.value)}
                                        className="DoctorProfile-form-input"
                                    >
                                        <option value="open">Open</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                    {hours.status === 'open' && (
                                        <>
                                            <input 
                                                type="time" 
                                                value={hours.open} 
                                                onChange={(e) => handleClinicHoursChange(day, 'open', e.target.value)}
                                                className="DoctorProfile-form-input" 
                                            />
                                            <input 
                                                type="time" 
                                                value={hours.close} 
                                                onChange={(e) => handleClinicHoursChange(day, 'close', e.target.value)}
                                                className="DoctorProfile-form-input" 
                                            />
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <button type="submit" className="DoctorProfile-submit-button" disabled={Object.keys(errors).length > 0}>
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DoctorProfile;