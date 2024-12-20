// src/routes/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("userToken");
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export const AdminProtectedRoute = ({ children }) => {
  const isAdminAuthenticated = localStorage.getItem("adminInfo");
  return isAdminAuthenticated ? children : <Navigate to="/admin/login" />;
};
