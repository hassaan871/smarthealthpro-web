import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import SignUpStep1 from "./components/authentication/signup/SignUpStep1";
import UserProfileCompletion from "./components/authentication/signup/UserProfileCompletion";
import { UserContextProvider } from "../src/components/context/UserContext";
import { SocketContextProvider } from "./components/context/SocketContext";
import ChatScreen from "./components/Chat/ChatScreen"; // Import the ChatScreen component
import DoctorChatWithPatientDetails from "./components/doctor/DoctorChatWithPatientDetails/DoctorChatWithPatientDetails";
import Dashboard from "./components/dashboard/Dashboard";
import ForgotPassword from "./components/authentication/forget/ForgetPassword";
import ResetPassword from "./components/authentication/forget/Reset";
import SignUpStep2 from "./components/authentication/signup/SignUpStep2";
import SignUpStep3 from "./components/authentication/signup/SignUpStep3";

function App() {
  return (
    <UserContextProvider>
      <SocketContextProvider>
        <Router>
          <Routes>
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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/doctorchatwithpatientdetail"
              element={<DoctorChatWithPatientDetails />}
            />
            <Route
              path="/profile-completion"
              element={<UserProfileCompletion />}
            />
            <Route path="/chat" element={<ChatScreen />} />{" "}
            {/* New route for chat */}
          </Routes>
        </Router>
      </SocketContextProvider>
    </UserContextProvider>
  );
}

export default App;
