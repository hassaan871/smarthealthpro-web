import React, { useState, useEffect, useContext } from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import Nav from "../Navbar/Nav";
import AppointmentProgressWidget from "./AppointmentProgressWidget";
import Patients from "./Patients";
import DoctorProfile from "../doctor/DoctorProfile/DoctorProfile";
import Overview from "./Overview";
import ChatScreen from "../Chat/ChatScreen";
import { AlertCircle } from "lucide-react";
import Context from "../context/context";
import axios from "axios";

const Dashboard = () => {
  const { setAppointments, setUserInfo } = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const [activeSection, setActiveSection] = useState(() => {
    // Set initial active section based on current path
    const path = location.pathname.split("/").pop();
    return path ? path.charAt(0).toUpperCase() + path.slice(1) : "Overview";
  });

  useEffect(() => {
    const fetchDoctorData = async () => {
      const userString = localStorage.getItem("userToken");
      const userId = userString;

      try {
        const userResponse = await axios.get(
          `http://localhost:5000/user/getUserInfo/${userId}`
        );
        const userData = userResponse.data.user;

        const doctorsResponse = await axios.get(
          "http://localhost:5000/user/getAllDoctors"
        );
        const doctorsData = doctorsResponse.data;

        const doctorData = doctorsData.find((doctor) => doctor.user === userId);
        const doctorId = doctorData ? doctorData._id : null;

        if (doctorId) {
          const doctorResponse = await axios.get(
            `http://localhost:5000/user/getDoctorById/${doctorId}`
          );
          const doctorDetails = doctorResponse.data;

          // Convert the fetched office hours to our internal format
          const formattedOfficeHours = {};
          Object.entries(doctorDetails.officeHours || {}).forEach(
            ([day, hours]) => {
              formattedOfficeHours[day] = {
                status: hours === "Closed" ? "closed" : "open",
                time: hours,
              };
            }
          );
          const User = {
            userData,
            doctor: doctorDetails,
          };

          setUserInfo(User);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDoctorData();
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const userString = localStorage.getItem("userToken");
        if (!userString) {
          throw new Error("User data not found in local storage");
        }
        const doctorId = userString;

        if (!doctorId) {
          throw new Error("Doctor ID not found in user data");
        }

        const response = await fetch(
          `http://localhost:5000/appointment/getAppointmentsByDoctorId/${doctorId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch appointments");
        }

        const data = await response.json();
        const pendingAppointments = data.filter(
          (apt) => apt.appointmentStatus === "pending"
        );
        setAppointments(pendingAppointments);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchAppointments();
  }, []);

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
