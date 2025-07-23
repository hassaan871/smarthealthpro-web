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
import { useAuth } from "../components/context/AuthContext";

const DoctorRoutes = () => {
  const { user } = useAuth();

  const NavigateToLogin = () => {
    console.log("Redirecting to login because of / doctor route");
    return <Navigate to="/login" />;
  };

  const Redirect404 = () => {
    console.log("Redirecting because of 404 doctorRoutes.js");
    return <Navigate to="/" replace />;
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<NavigateToLogin />} />

      <Route
        path="/login"
        element={
          user ? <Navigate to="/dashboard/overview" replace /> : <Login />
        }
      />

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
        <Route
          index
          element={user ? <Navigate to="overview" /> : <Navigate to="/login" />}
        />
        <Route path="overview" element={<DashboardOverview />} />
        <Route path="appointments" element={<DashboardAppointments />} />
        <Route path="patients" element={<DashboardPatients />} />
        <Route path="chat" element={<ChatScreen />} />
        <Route path="chat/:conversationId" element={<ChatScreen />} />
        <Route path="profile" element={<DashboardProfile />} />
      </Route>

      {/* Catch all route - 404 */}
      <Route path="*" element={<Redirect404 />} />
    </Routes>
  );
};

export default DoctorRoutes;
