// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./components/authentication/login/Login";
import SignUp from "./components/authentication/signup/SignUp";
import UserProfileCompletion from "./components/authentication/signup/UserProfileCompletion";
import DoctorChat from "./components/doctor/DoctorChat/DoctorChat";
import DoctorChatWithPatientDetails from "./components/doctor/DoctorChatWithPatientDetails/DoctorChatWithPatientDetails";
import DoctorProfile from './components/doctor/DoctorProfile/DoctorProfile';
import Nav from './components/Navbar/Nav';
import Dashboard from './components/dashboard/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile-completion" element={<UserProfileCompletion />} />
        <Route path="/doctorchat" element={<DoctorChat/>} />
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
