// src/routes/AdminRoutes.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "../module/Admin/AdminLogin";
import AdminOverview from "../module/Admin/AdminOverview";
import AdminDoctors from "../module/Admin/AdminDoctors";
import AdminPatients from "../module/Admin/AdminPatients";
import AdminApproveDoctors from "../module/Admin/AdminApproveDoctors";
import { AdminProtectedRoute } from "./ProtectedRoute";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/login" />} />
      <Route path="/login" element={<AdminLogin />} />
      <Route
        path="/AdminOverview"
        element={
          //   <AdminProtectedRoute>
          <AdminOverview />
          //   </AdminProtectedRoute>
        }
      />
      <Route path="/adminDoctors" element={<AdminDoctors/>} />{/*  */}
      <Route path="/adminPatients" element={<AdminPatients />} />
      <Route path="/adminApproveDoctors" element={<AdminApproveDoctors />} />
      <Route path="*" element={<Navigate to="/admin/login" />} />
    </Routes>
  );
};

export default AdminRoutes;
