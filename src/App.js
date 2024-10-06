// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./components/authentication/login/Login";
import SignUp from "./components/authentication/signup/SignUp";
import UserProfileCompletion from "./components/authentication/signup/UserProfileCompletion";
import DoctorDashboard from "./components/doctor/DoctorDashboard/DoctorDashboard";
import DoctorChat from "./components/doctor/DoctorChat/DoctorChat";
import DoctorChatWithPatientDetails from "./components/doctor/DoctorChatWithPatientDetails/DoctorChatWithPatientDetails";
import PatientDetails from "./components/doctor/PatientDetails/PatientDetails";
import AllPatients from './components/doctor/DoctorDashboard/AllPatients';
import DoctorProfile from './components/doctor/DoctorProfile/DoctorProfile';
import Nav from './components/Navbar/Nav';
import Dashboard from './components/dashboard/Dashboard';

function App() {
  const doctorId = '66c0b2aa90040b7bc334b842';
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AllPatients doctorId={doctorId} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile-completion" element={<UserProfileCompletion />} />
        <Route path="/doctordashboard" element={<DoctorDashboard doctorId={doctorId}/>} />
        <Route path="/doctorchat" element={<DoctorChat/>} />
        <Route path="/patientdetails" element={<PatientDetails/>} />
        <Route path="/doctorchatwithpatientdetail" element={<DoctorChatWithPatientDetails/>} />
        <Route path="/doctorprofile" element={<DoctorProfile/>} />
      </Routes>
    </Router>
    // <>
    // <Nav/>
    // <DoctorProfile/>
    // </>
  );
}

export default App;
