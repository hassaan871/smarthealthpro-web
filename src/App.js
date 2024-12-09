// import React from "react";
// import {
//   BrowserRouter as Router,
//   Route,
//   Routes,
//   Navigate,
// } from "react-router-dom";

// // Authentication Components
// import Login from "./components/authentication/login/Login";
// import SignUp from "./components/authentication/signup/SignUp"; // New combined component
// import ForgotPassword from "./components/authentication/forget/ForgetPassword";
// import ResetPassword from "./components/authentication/forget/Reset";
// import UserProfileCompletion from "./components/authentication/signup/UserProfileCompletion";

// // Context Providers
// import { MyContextProvider } from "./components/context/context";
// import { SocketContextProvider } from "./components/context/SocketContext";

// // Dashboard and Main Components
// import Dashboard, {
//   DashboardOverview,
//   DashboardAppointments,
//   DashboardPatients,
//   DashboardChat,
//   DashboardProfile,
// } from "./components/dashboard/Dashboard";
// import ChatScreen from "./components/Chat/ChatScreen";
// import DoctorChatWithPatientDetails from "./components/doctor/DoctorChatWithPatientDetails/DoctorChatWithPatientDetails";

// // Protected Route Component
// const ProtectedRoute = ({ children }) => {
//   const isAuthenticated = localStorage.getItem("userToken");
//   return isAuthenticated ? children : <Navigate to="/login" />;
// };

// function App() {
//   return (
//     <MyContextProvider>
//       <SocketContextProvider>
//         <Router>
//           <Routes>
//             {/* Public Routes */}
//             <Route path="/" element={<Navigate to="/login" />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/signup" element={<SignUp />} />
//             <Route path="/forgot-password" element={<ForgotPassword />} />
//             <Route
//               path="/user/reset-password/:userId/:token"
//               element={<ResetPassword />}
//             />

//             {/* Protected Routes */}
//             <Route
//               path="/profile-completion"
//               element={
//                 <ProtectedRoute>
//                   <UserProfileCompletion />
//                 </ProtectedRoute>
//               }
//             />

//             {/* Protected Dashboard Routes */}
//             <Route
//               path="/dashboard"
//               element={
//                 <ProtectedRoute>
//                   <Dashboard />
//                 </ProtectedRoute>
//               }
//             >
//               <Route
//                 index
//                 element={<Navigate to="/dashboard/overview" replace />}
//               />
//               <Route path="overview" element={<DashboardOverview />} />
//               <Route path="appointments" element={<DashboardAppointments />} />
//               <Route path="patients" element={<DashboardPatients />} />
//               <Route path="chat" element={<ChatScreen />} />
//               <Route path="chat/:conversationId" element={<ChatScreen />} />
//               <Route path="profile" element={<DashboardProfile />} />
//             </Route>

//             {/* Catch all route - 404 */}
//             <Route path="*" element={<Navigate to="/login" replace />} />

//             {/* Admin routes */}
//             <Route path="/AdminLogin" element={<AdminLogin />} />
//           </Routes>
//         </Router>
//       </SocketContextProvider>
//     </MyContextProvider>
//   );
// }

// export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "../src/module/Admin/AdminLogin";
import AdminOverview from "../src/module/Admin/AdminOverview";
import AdminNavbar from "../src/module/Admin/AdminNavbar";

const App = () => {
  return (
    <Router>
      <AdminNavbar />
      <Routes>
        {/* Define routes for different components */}
        <Route path="/" element={<AdminOverview />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/admindashboard/overview" element={<AdminOverview />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;
