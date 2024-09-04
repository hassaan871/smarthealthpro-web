// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./components/authentication/login/Login";
import SignUp from "./components/authentication/signup/SignUp";
import UserProfileCompletion from "./components/authentication/signup/UserProfileCompletion";
import DoctorDashboard from "./components/doctor/DoctorDashboard/DoctorDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile-completion" element={<UserProfileCompletion />} />
        <Route path="/dashboard" element={<DoctorDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
