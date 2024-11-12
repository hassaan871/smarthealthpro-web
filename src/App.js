import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

// Authentication Components
import Login from "./components/authentication/login/Login";
import SignUpStep1 from "./components/authentication/signup/SignUpStep1";
import SignUpStep2 from "./components/authentication/signup/SignUpStep2";
import SignUpStep3 from "./components/authentication/signup/SignUpStep3";
import UserProfileCompletion from "./components/authentication/signup/UserProfileCompletion";
import ForgotPassword from "./components/authentication/forget/ForgetPassword";
import ResetPassword from "./components/authentication/forget/Reset";

// Context Providers
import { MyContextProvider } from "./components/context/context";
import { SocketContextProvider } from "./components/context/SocketContext";

// Dashboard and Main Components
import Dashboard, {
  DashboardOverview,
  DashboardAppointments,
  DashboardPatients,
  DashboardChat,
  DashboardProfile,
} from "./components/dashboard/Dashboard";
import ChatScreen from "./components/Chat/ChatScreen";
import DoctorChatWithPatientDetails from "./components/doctor/DoctorChatWithPatientDetails/DoctorChatWithPatientDetails";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("userToken");
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <MyContextProvider>
      <SocketContextProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/SignUpStep1" element={<SignUpStep1 />} />
            <Route path="/SignUpStep2" element={<SignUpStep2 />} />
            <Route path="/SignUpStep3" element={<SignUpStep3 />} />
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
              {/* Redirect /dashboard to /dashboard/overview */}
              <Route
                index
                element={<Navigate to="/dashboard/overview" replace />}
              />
              <Route path="overview" element={<DashboardOverview />} />
              <Route path="appointments" element={<DashboardAppointments />} />
              <Route path="patients" element={<DashboardPatients />} />
              <Route path="chat" element={<DashboardChat />} />
              <Route path="profile" element={<DashboardProfile />} />
              <Route
                path="doctorchatwithpatientdetail"
                element={<DoctorChatWithPatientDetails />}
              />
            </Route>

            {/* Standalone Chat Route (if needed) */}
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <ChatScreen />
                </ProtectedRoute>
              }
            />

            {/* Catch all route - 404 */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </SocketContextProvider>
    </MyContextProvider>
  );
}

export default App;
