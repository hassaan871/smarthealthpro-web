// src/routes/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../components/context/AuthContext";

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (user === null && !loading) {
    console.log("🔄 Redirecting to /login because of protected routes");

    return <Navigate to="/login" />;
  }

  return children;
};

export const AdminProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user || user.role !== "admin") {
    console.log("Not admin — redirecting to /admin/login");
    return <Navigate to="/admin/login" />;
  }

  return children;
};
