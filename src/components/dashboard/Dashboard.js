import React, { useState } from 'react';
import Nav from "../Navbar/Nav";
import Appointments from "./Appointments";
import AppointmentProgressWidget from "./AppointmentProgressWidget"
import Patients from "./Patients";
import DoctorProfile from '../doctor/DoctorProfile/DoctorProfile';

const Dashboard = () => {
    const [activeSection, setActiveSection] = useState('Appointments');

    const renderSection = () => {
        switch(activeSection) {
            case 'Appointments':
                // return <Appointments />;
                return <AppointmentProgressWidget />;
            case 'Patients':
                return <Patients />;
            case 'Profile':
                return <DoctorProfile />;
            default:
                return <Appointments />;
        }
    };

    return (
        <div>
            <Nav setActiveSection={setActiveSection} />
            {renderSection()}
        </div>
    );
};

export default Dashboard;