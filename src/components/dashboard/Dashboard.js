import React, { useState } from 'react';
import Nav from "../Navbar/Nav";
import AppointmentProgressWidget from "./AppointmentProgressWidget"
import Patients from "./Patients";
import DoctorProfile from '../doctor/DoctorProfile/DoctorProfile';
import Overview from './Overview';

const Dashboard = () => {
    const [activeSection, setActiveSection] = useState('Appointments');

    const renderSection = () => {
        switch(activeSection) {
            case 'Overview':
                return <Overview />
            case 'Appointments':
                return <AppointmentProgressWidget />;
                // return <AppointmentProgressWidget style={{ width: '100%' }} />;
            case 'Patients':
                return <Patients />;
            case 'Profile':
                return <DoctorProfile />;
            default:
                return <Overview />;
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