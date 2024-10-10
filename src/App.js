// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from "./components/authentication/login/Login";
import SignUpStep1 from "./components/authentication/signup/SignUpStep1";
import UserProfileCompletion from "./components/authentication/signup/UserProfileCompletion";
import DoctorChatWithPatientDetails from "./components/doctor/DoctorChatWithPatientDetails/DoctorChatWithPatientDetails";
import Dashboard from './components/dashboard/Dashboard';
import ForgotPassword from './components/authentication/forget/ForgetPassword';
import ResetPassword from './components/authentication/forget/Reset';
import SignUpStep2 from './components/authentication/signup/SignUpStep2';
import SignUpStep3 from './components/authentication/signup/SignUpStep3';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to='/login' />} />
        <Route path="/login" element={<Login />} />
        <Route path="/SignUpStep1" element={<SignUpStep1/>} />
        <Route path="/SignUpStep2" element={<SignUpStep2/>} />
        <Route path="/SignUpStep3" element={<SignUpStep3/>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/user/reset-password/:userId/:token" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/doctorchatwithpatientdetail" element={<DoctorChatWithPatientDetails/>} />
        <Route path="/profile-completion" element={<UserProfileCompletion />} />
      </Routes>
    </Router>
  );
}

export default App;
