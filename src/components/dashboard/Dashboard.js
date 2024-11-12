import React, { useState, useEffect } from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import Nav from "../Navbar/Nav";
import AppointmentProgressWidget from "./AppointmentProgressWidget";
import Patients from "./Patients";
import DoctorProfile from "../doctor/DoctorProfile/DoctorProfile";
import Overview from "./Overview";
import ChatScreen from "../Chat/ChatScreen";
import { AlertCircle } from "lucide-react";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const [activeSection, setActiveSection] = useState(() => {
    // Set initial active section based on current path
    const path = location.pathname.split("/").pop();
    return path ? path.charAt(0).toUpperCase() + path.slice(1) : "Overview";
  });

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

      <style jsx>{`
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
      `}</style>
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
