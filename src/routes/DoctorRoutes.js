// src/routes/DoctorRoutes.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../components/authentication/login/Login";
import SignUp from "../components/authentication/signup/SignUp";
import ForgotPassword from "../components/authentication/forget/ForgetPassword";
import ResetPassword from "../components/authentication/forget/Reset";
import UserProfileCompletion from "../components/authentication/signup/UserProfileCompletion";
import Dashboard from "../components/dashboard/Dashboard";
import {
  DashboardOverview,
  DashboardAppointments,
  DashboardPatients,
  DashboardProfile,
} from "../components/dashboard/Dashboard";
import ChatScreen from "../components/Chat/ChatScreen";
import { ProtectedRoute } from "./ProtectedRoute";

const DoctorRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/user/reset-password/:userId/:token"
        element={<ResetPassword />}
      />

      {/* Protected Routes */}
      <Route
        path="/profile-completion"
        element={
          <ProtectedRoute>
            <UserProfileCompletion />
          </ProtectedRoute>
        }
      />

      {/* Protected Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard/overview" replace />} />
        <Route path="overview" element={<DashboardOverview />} />
        <Route path="appointments" element={<DashboardAppointments />} />
        <Route path="patients" element={<DashboardPatients />} />
        <Route path="chat" element={<ChatScreen />} />
        <Route path="chat/:conversationId" element={<ChatScreen />} />
        <Route path="profile" element={<DashboardProfile />} />
      </Route>

      {/* Catch all route - 404 */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default DoctorRoutes;
