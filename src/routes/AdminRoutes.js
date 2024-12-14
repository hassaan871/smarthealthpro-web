// src/routes/AdminRoutes.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "../module/Admin/AdminLogin";
import AdminOverview from "../module/Admin/AdminOverview";
import { AdminProtectedRoute } from "./ProtectedRoute";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/login" />} />
      <Route path="/login" element={<AdminLogin />} />
      <Route
        path="/dashboard"
        element={
          //   <AdminProtectedRoute>
          <AdminOverview />
          //   </AdminProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/admin/login" />} />
    </Routes>
  );
};

export default AdminRoutes;
