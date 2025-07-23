import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "../module/Admin/AdminLogin";
import AdminOverview from "../module/Admin/AdminOverview";
import AdminDoctors from "../module/Admin/AdminDoctors";
import AdminPatients from "../module/Admin/AdminPatients";
import AdminApproveDoctors from "../module/Admin/AdminApproveDoctors";

const AdminProtectedRoute = ({ children }) => {
  const adminInfo = localStorage.getItem("adminInfo");
  if (!adminInfo) {
    console.log("Admin not authenticated, redirecting to login.");
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

// New component for handling unauthorized state
const AdminUnauthorizedRoute = ({ children }) => {
  const adminInfo = localStorage.getItem("adminInfo");
  if (adminInfo) {
    return <Navigate to="/admin/overview" replace />;
  }
  return children;
};

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Default route */}
      <Route
        path="/"
        element={
          localStorage.getItem("adminInfo") ? (
            <Navigate to="overview" replace />
          ) : (
            <Navigate to="login" replace />
          )
        }
      />

      {/* Login route - redirects to overview if already logged in */}
      <Route
        path="login"
        element={
          <AdminUnauthorizedRoute>
            <AdminLogin />
          </AdminUnauthorizedRoute>
        }
      />

      {/* Protected routes */}
      <Route
        path="overview"
        element={
          <AdminProtectedRoute>
            <AdminOverview />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="doctors"
        element={
          <AdminProtectedRoute>
            <AdminDoctors />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="patients"
        element={
          <AdminProtectedRoute>
            <AdminPatients />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="approve"
        element={
          <AdminProtectedRoute>
            <AdminApproveDoctors />
          </AdminProtectedRoute>
        }
      />

      {/* Catch all route - redirects to overview if logged in, login if not */}
      <Route
        path="*"
        element={(() => {
          if (localStorage.getItem("adminInfo")) {
            return <Navigate to="/admin/overview" replace />;
          } else {
            console.log("Admin not authenticated, redirecting to login.");
            return <Navigate to="/admin/login" replace />;
          }
        })()}
      />
    </Routes>
  );
};

export default AdminRoutes;
