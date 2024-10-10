import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUpStep2() {
  const [specialization, setSpecialization] = useState('');
  const [cnic, setCnic] = useState('');
  const [address, setAddress] = useState('');
  const [about, setAbout] = useState('');
  const [officeHours, setOfficeHours] = useState({
    sunday: { status: 'Closed', openTime: '', closeTime: '' },
    monday: { status: 'Closed', openTime: '', closeTime: '' },
    tuesday: { status: 'Closed', openTime: '', closeTime: '' },
    wednesday: { status: 'Closed', openTime: '', closeTime: '' },
    thursday: { status: 'Closed', openTime: '', closeTime: '' },
    friday: { status: 'Closed', openTime: '', closeTime: '' },
    saturday: { status: 'Closed', openTime: '', closeTime: '' },
  });
  const [education, setEducation] = useState([{ degree: '', institution: '', year: '' }]);

  const navigate = useNavigate();

  // Function to generate 24-hour time options in 12-hour AM/PM format
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minutes = 0; minutes < 60; minutes += 15) { // Incrementing by 15 minutes
        const hour12 = hour % 12 || 12; // Convert to 12-hour format
        const ampm = hour < 12 ? 'AM' : 'PM';
        const time = `${hour12}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
        times.push(time);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions(); // All time options for 24 hours

  // Handle office hours changes
  const handleOfficeHoursChange = (day, field, value) => {
    setOfficeHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
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
            {/* Specialization */}
          <h5>personal Information</h5>

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

            {/* CNIC */}
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
                required 
              />
            </div>
            <div className="col-md-4">
              <input 
                type="text" 
                className="form-control mb-2" 
                value={edu.institution} 
                placeholder="Institution" 
                required 
              />
            </div>
            <div className="col-md-4">
              <input 
                type="text" 
                className="form-control mb-2" 
                value={edu.year} 
                placeholder="Year of Graduation" 
                required 
              />
            </div>
          </div>
        ))}
          </div>

          {/* Middle column */}
          <div className="col-md-4">
            {/* Address */}
            <h5>personal Information</h5>
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

            {/* About */}
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
            {/* Any additional content for the third column */}
            <div className="form-group mb-3">
  <h5 >Office Hours</h5>
  {['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map((day, index) => {
    // Render two days in one row
    if (index % 2 === 0) {
      return (
        <div className="row mb-3" key={day}>
          {['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].slice(index, index + 2).map((dayInPair) => (
            <div className="col-md-6" key={dayInPair}>
              <div className="row">
                <div className="col-md-6">
                  <label>{dayInPair.charAt(0).toUpperCase() + dayInPair.slice(1)}</label>
                </div>
                <div className="col-md-6">
                  <select
                    className="form-control mb-2"
                    value={officeHours[dayInPair].status}
                    onChange={(e) => handleOfficeHoursChange(dayInPair, 'status', e.target.value)}
                    required
                  >
                    <option value="Closed">Closed</option>
                    <option value="Open">Open</option>
                  </select>
                </div>
              </div>
              {officeHours[dayInPair].status === 'Open' && (
                <div className="row">
                  <div className="col-md-6">
                    <label>Opening Time</label>
                    <select
                      className="form-control"
                      value={officeHours[dayInPair].openTime}
                      onChange={(e) => handleOfficeHoursChange(dayInPair, 'openTime', e.target.value)}
                      required
                    >
                      <option value="">Select Opening Time</option>
                      {timeOptions.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label>Closing Time</label>
                    <select
                      className="form-control"
                      value={officeHours[dayInPair].closeTime}
                      onChange={(e) => handleOfficeHoursChange(dayInPair, 'closeTime', e.target.value)}
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
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }
    return null; // Return nothing for the even index, since it's handled in pairs
  })}
</div>


          </div>
        </div>

        {/* Education Section */}
      

       

        <button type="submit" className="btn btn-primary w-100">Next</button>
      </form>
    </div>
  </div>
</div>

  );
}

export default SignUpStep2;

