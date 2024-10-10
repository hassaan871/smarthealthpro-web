import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUpStep2() {
  const [specialization, setSpecialization] = useState('');
  const [cnic, setCnic] = useState('');
  const [address, setAddress] = useState('');
  const [about, setAbout] = useState('');
  const [education, setEducation] = useState([{ degree: '', institution: '', year: '' }]);

  const [officeHours, setOfficeHours] = useState({
    sunday: 'Closed',
    monday: 'Closed',
    tuesday: 'Closed',
    wednesday: 'Closed',
    thursday: 'Closed',
    friday: 'Closed',
    saturday: 'Closed',
  });

  const navigate = useNavigate();

  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...education];
    updatedEducation[index][field] = value;
    setEducation(updatedEducation);
  };

  // Function to generate 24-hour time options in 12-hour AM/PM format
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minutes = 0; minutes < 60; minutes += 15) {
        const hour12 = hour % 12 || 12;
        const ampm = hour < 12 ? 'AM' : 'PM';
        const time = `${hour12}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
        times.push(time);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  const handleOfficeHoursChange = (day, value) => {
    setOfficeHours((prev) => ({
      ...prev,
      [day]: value,
    }));
  };

  const handleNextStep = (event) => {
    event.preventDefault();

    const additionalData = {
      specialization,
      cnic,
      address,
      about,
      officeHours,
      education,
    };

    localStorage.setItem('additionalData', JSON.stringify(additionalData));

    navigate('/SignUpStep3');
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="row w-100">
        <div className="d-flex flex-column justify-content-center p-4">
          <h2 className="text-center mb-4">Additional Information</h2>
          <form onSubmit={handleNextStep} className="w-100">
            <div className="row">
              {/* Left column */}
              <div className="col-md-4">
                <h5>Personal Information</h5>
                <div className="form-group mb-3">
                  <input 
                    type="text" 
                    className="form-control" 
                    value={specialization} 
                    onChange={(e) => setSpecialization(e.target.value)} 
                    placeholder="Specialization" 
                    required 
                  />
                </div>
                <div className="form-group mb-3">
                  <input 
                    type="text" 
                    className="form-control" 
                    value={cnic} 
                    onChange={(e) => setCnic(e.target.value)} 
                    placeholder="CNIC" 
                    required 
                  />
                </div>
                <h5 className="mt-4">Education</h5>
                {education.map((edu, index) => (
                  <div key={index} className="row mb-3">
                    <div className="col-md-4">
                      <input 
                        type="text" 
                        className="form-control mb-2" 
                        value={edu.degree} 
                        placeholder="Degree" 
                        onChange={(e) => handleEducationChange(index, 'degree', e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="col-md-4">
                      <input 
                        type="text" 
                        className="form-control mb-2" 
                        value={edu.institution} 
                        onChange={(e) => handleEducationChange(index, 'institution', e.target.value)} 
                        placeholder="Institution" 
                        required 
                      />
                    </div>
                    <div className="col-md-4">
                      <input 
                        type="text" 
                        className="form-control mb-2" 
                        value={edu.year} 
                        onChange={(e) => handleEducationChange(index, 'year', e.target.value)} 
                        placeholder="Year of Graduation" 
                        required 
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Middle column */}
              <div className="col-md-4">
                <h5>Personal Information</h5>
                <div className="form-group mb-3">
                  <input 
                    type="text" 
                    className="form-control" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    placeholder="Address" 
                    required 
                  />
                </div>
                <div className="form-group mb-3">
                  <textarea 
                    className="form-control" 
                    value={about} 
                    onChange={(e) => setAbout(e.target.value)} 
                    placeholder="About" 
                    rows="4"
                    required 
                  />
                </div>
              </div>

              {/* Right column */}
              <div className="col-md-4">
                <h5>Office Hours</h5>
                {['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map((day) => (
                  <div className="form-group mb-3" key={day}>
                    <label>{day.charAt(0).toUpperCase() + day.slice(1)}</label>
                    <select
                      className="form-control mb-2"
                      value={officeHours[day]}
                      onChange={(e) => handleOfficeHoursChange(day, e.target.value)}
                      required
                    >
                      <option value="Closed">Closed</option>
                      <option value="Open">Open</option>
                    </select>
                    {officeHours[day] === 'Open' && (
                      <div>
                        <label>Opening Time</label>
                        <select
                          className="form-control"
                          required
                        >
                          <option value="">Select Opening Time</option>
                          {timeOptions.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                        <label>Closing Time</label>
                        <select
                          className="form-control"
                          required
                        >
                          <option value="">Select Closing Time</option>
                          {timeOptions.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100">Next</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUpStep2;


