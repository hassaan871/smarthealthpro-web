// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from "./components/authentication/login/Login";
import SignUp from "./components/authentication/signup/SignUp";
import UserProfileCompletion from "./components/authentication/signup/UserProfileCompletion";
import DoctorChatWithPatientDetails from "./components/doctor/DoctorChatWithPatientDetails/DoctorChatWithPatientDetails";
import Dashboard from './components/dashboard/Dashboard';
import ForgotPassword from './components/authentication/forget/ForgetPassword';
import ResetPassword from './components/authentication/forget/Reset';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to='/login' />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
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
