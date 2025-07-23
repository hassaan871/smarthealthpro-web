import React, { useState, useEffect, useContext } from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import Nav from "../Navbar/Nav";
import AppointmentProgressWidget from "./AppointmentProgressWidget";
import Patients from "./Patients";
import DoctorProfile from "../doctor/DoctorProfile/DoctorProfile";
import Overview from "./Overview";
import ChatScreen from "../Chat/ChatScreen";
import { AlertCircle } from "lucide-react";
// pages/Appointments.jsx
import { useAuth } from "../context/AuthContext";
import api from "../../api/axiosInstance";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const [activeSection, setActiveSection] = useState(() => {
    // Set initial active section based on current path
    const path = location.pathname.split("/").pop();
    return path ? path.charAt(0).toUpperCase() + path.slice(1) : "Overview";
  });

  useEffect(() => {
    const fetchDoctorAndAppointments = async () => {
      console.log(
        "[Effect Triggered] Checking if user and loading state are valid..."
      );

      if (loading) {
        console.log("Still loading auth...");
        return;
      }

      if (!user || !user._id) {
        console.warn("❌ No user or user._id found.");
        return;
      }

      console.log("✅ Authenticated User:", user);

      setIsLoading(true);

      try {
        // === 1. Fetch User Info ===
        console.log("📡 Fetching user info...");
        const userResponse = await api.get(`/user/getUserInfo`);
        const userData = userResponse.data.user;
        console.log("✅ User Info Received:", userData);

        // === 2. Fetch All Doctors ===
        console.log("📡 Fetching all doctors...");
        const doctorsResponse = await api.get("/user/getAllDoctors");
        const doctorsData = doctorsResponse.data;
        console.log("✅ Doctors List Received:", doctorsData.length);

        // === 3. Find Doctor ===
        const doctorData = doctorsData.find(
          (doctor) => doctor.user === user._id
        );

        // === 4. Fetch Doctor Details ===
        console.log("📡 Fetching doctor details...");
        const doctorResponse = await api.get(`/user/getDoctorById`);
        const doctorDetails = doctorResponse.data;
        console.log("✅ Doctor Details Received");

        // === 5. Format Office Hours ===
        const formattedOfficeHours = {};
        Object.entries(doctorDetails.officeHours || {}).forEach(
          ([day, hours]) => {
            formattedOfficeHours[day] = {
              status: hours === "Closed" ? "closed" : "open",
              time: hours,
            };
          }
        );

        console.log("✅ User Info set in Context");
      } catch (err) {
        console.error("❌ Error during fetchDoctorAndAppointments:", err);
      } finally {
        setIsLoading(false);
        console.log("✅ Loading state turned off");
      }
    };

    fetchDoctorAndAppointments();
  }, [user, loading]);

  // Add effect to handle route changes
  useEffect(() => {
    const path = location.pathname.split("/").pop();
    setActiveSection(
      path ? path.charAt(0).toUpperCase() + path.slice(1) : "Overview"
    );
  }, [location]);

  // Error Fallback Component
  const ErrorFallback = ({ error }) => (
    <div className="p-6 max-w-xl mx-auto mt-8 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800">
      <div className="flex items-center space-x-3">
        <AlertCircle className="w-6 h-6 text-red-500" />
        <h2 className="text-lg font-semibold text-red-800 dark:text-red-200">
          Something went wrong
        </h2>
      </div>
      <p className="mt-2 text-sm text-red-700 dark:text-red-300">
        {error?.message || "An error occurred while loading this section."}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-200 rounded-md hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
      >
        Refresh Page
      </button>
    </div>
  );

  // Loading Component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B1121]">
      <Nav setActiveSection={setActiveSection} activeSection={activeSection} />
      <main className="w-full" style={{ marginTop: "60px" }}>
        <div className="fade-in">
          {isLoading ? <LoadingSpinner /> : <Outlet />}
        </div>
      </main>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        :global(.container-fluid) {
          width: 100% !important;
          padding-right: 1.5rem !important;
          padding-left: 1.5rem !important;
          margin-right: auto !important;
          margin-left: auto !important;
        }

        :global(.card) {
          margin-bottom: 1rem;
        }
        `,
        }}
      />
    </div>
  );
};

// Create individual route components
export const DashboardOverview = () => (
  <div className="fade-in">
    <Overview />
  </div>
);

export const DashboardAppointments = () => (
  <div className="fade-in">
    <AppointmentProgressWidget />
  </div>
);

export const DashboardPatients = () => (
  <div className="fade-in">
    <Patients />
  </div>
);

export const DashboardChat = () => (
  <div className="fade-in">
    <ChatScreen />
  </div>
);

export const DashboardProfile = () => (
  <div className="fade-in">
    <DoctorProfile />
  </div>
);

export default Dashboard;
