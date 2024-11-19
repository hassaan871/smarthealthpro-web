import React, { useContext, useEffect } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  RefreshCw,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Calendar,
  Clock,
  PinIcon,
  MessageSquare,
} from "lucide-react";
import Context from "../context/context";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Overview = () => {
  const { appointments, setAppointments } = useContext(Context);
  const navigate = useNavigate();

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

  const salesData = [
    { name: "Jan", value: 18 },
    { name: "Feb", value: 16 },
    { name: "Mar", value: 5 },
    { name: "Apr", value: 8 },
    { name: "May", value: 3 },
    { name: "Jun", value: 14 },
    { name: "Jul", value: 14 },
    { name: "Aug", value: 16 },
    { name: "Sep", value: 17 },
    { name: "Oct", value: 18 },
    { name: "Nov", value: 17 },
    { name: "Dec", value: 19 },
  ];

  const trafficData = [
    { name: "Completed", value: 63 },
    { name: "Pending", value: 15 },
    { name: "TBD", value: 22 },
  ];
  const COLORS = ["#60A5FA", "#F59E0B", "#10B981"];

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    trendValue,
    color,
    progress,
  }) => (
    <div className="card bg-gray-800 border-0 shadow-lg">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="card-subtitle text-gray-400">{title}</h6>
          <div
            className={`rounded-circle p-2 text-white bg-${
              color || "primary"
            } bg-opacity-10`}
          >
            <Icon size={20} className={`text-${color || "primary"}`} />
          </div>
        </div>
        <h2 className="card-title mb-2 text-white">{value}</h2>
        {trend && (
          <small
            className={`text-${
              trend === "up" ? "success" : "danger"
            } d-flex align-items-center`}
          >
            {trend === "up" ? (
              <ArrowUpRight size={16} />
            ) : (
              <ArrowDownRight size={16} />
            )}
            {trendValue} Since last month
          </small>
        )}
        {progress && (
          <div className="progress mt-2 bg-gray-700">
            <div
              className="progress-bar bg-primary"
              role="progressbar"
              style={{ width: progress + "%" }}
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        )}
      </div>
    </div>
  );

  const handleViewClick = async (appointment) => {
    try {
      const userId = localStorage.getItem("userToken");
      if (!userId) {
        throw new Error("User not authenticated");
      }

      // Get all conversations for the current user
      const conversationsResponse = await axios.get(
        `http://localhost:5000/conversations/${userId}`
      );

      const conversations = conversationsResponse.data;
      console.log("All conversations:", conversations);
      console.log("Current userId:", userId);
      console.log("Patient ID to match:", appointment.patient.id);

      // Modified conversation finding logic
      const existingConversation = conversations.find((conv) => {
        // The participants array contains the direct IDs, so this comparison should work
        return (
          conv.participants.includes(userId) &&
          conv.participants.includes(appointment.patient.id)
        );
      });

      console.log("Found existing conversation:", existingConversation);

      const navigationState = {
        conversation: existingConversation
          ? {
              ...existingConversation,
              _id: existingConversation._id, // Convert _id to string format if needed
            }
          : null,
        patient: !existingConversation ? appointment.patient : null,
        doctorInfo: {
          id: userId,
          avatar: appointment?.doctor?.avatar,
          name: appointment?.doctor?.name,
        },
      };

      console.log("Navigation state being passed:", navigationState);

      navigate("/dashboard/chat", {
        state: navigationState,
        replace: true,
      });
    } catch (error) {
      console.error("Error handling chat:", error);
      alert("Failed to open chat. Please try again.");
    }
  };

  return (
    <div
      className="container-fluid bg-gray-900"
      style={{
        width: "99vw",
        minHeight: "100vh", // Ensures minimum full viewport height
        paddingBottom: "2rem", // Adds bottom padding
      }}
    >
      <div className="row mb-4 g-3" style={{ paddingTop: "25px" }}>
        <div className="col-md-3">
          <StatCard
            title="Total Patients"
            value="24"
            icon={Users}
            trend="up"
            trendValue="12%"
            color="warning"
          />
        </div>
        <div className="col-md-3">
          <StatCard
            title="Total Appointments"
            value="16"
            icon={Calendar}
            trend="down"
            trendValue="16%"
            color="info"
          />
        </div>
        <div className="col-md-3">
          <StatCard
            title="Pending Appointments"
            value="10"
            icon={PinIcon}
            progress={75.5}
            color="primary"
          />
        </div>
        <div className="col-md-3">
          <StatCard
            title="TBD Appointments"
            value="6"
            icon={Clock}
            color="success"
          />
        </div>
      </div>

      <div className="row mb-4 g-3">
        <div className="col-md-8">
          <div className="card bg-gray-800 border-0 shadow-lg">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="card-title text-white">Appointments Overview</h5>
                <button className="btn btn-outline-secondary d-flex align-items-center gap-2">
                  <RefreshCw size={16} /> Sync
                </button>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "none",
                    }}
                    labelStyle={{ color: "#F3F4F6" }}
                  />
                  <Bar dataKey="value" fill="#60A5FA" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-gray-800 border-0 shadow-lg">
            <div className="card-body">
              <h5 className="card-title mb-4 text-white">
                Appointment Status: October
              </h5>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={trafficData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${value}`} // Custom label formatter
                  >
                    {trafficData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value}%`, name]} // Format tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "none",
                      color: "#F3F4F6",
                    }}
                    itemStyle={{
                      // Add this to control individual item text color
                      color: "#F3F4F6",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="d-flex justify-content-around mt-3 text-gray-300">
                <small className="d-flex align-items-center gap-1">
                  <span
                    className="d-inline-block rounded-circle"
                    style={{ width: 8, height: 8, backgroundColor: COLORS[0] }}
                  ></span>
                  Completed: 63%
                </small>
                <small className="d-flex align-items-center gap-1">
                  <span
                    className="d-inline-block rounded-circle"
                    style={{ width: 8, height: 8, backgroundColor: COLORS[1] }}
                  ></span>
                  Pending: 15%
                </small>
                <small className="d-flex align-items-center gap-1">
                  <span
                    className="d-inline-block rounded-circle"
                    style={{ width: 8, height: 8, backgroundColor: COLORS[2] }}
                  ></span>
                  TBD: 22%
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <div className="card bg-gray-800 border-0 shadow-lg">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="card-title text-white">Latest Patients</h5>
                <a
                  href="/dashboard/patients"
                  className="text-decoration-none text-primary"
                >
                  View all →
                </a>
              </div>
              <ul className="list-group list-group-flush bg-transparent">
                {appointments.map((appointment, index) => (
                  <li
                    key={index}
                    className="list-group-item bg-transparent border-gray-700 d-flex justify-content-between align-items-center"
                  >
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={
                          appointment?.patient?.avatar?.url?.length > 0
                            ? appointment?.patient?.avatar?.url
                            : appointment?.patient?.avatar
                        }
                        alt={
                          "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
                        }
                        className="rounded-circle"
                        width="40"
                        height="40"
                      />
                      <div>
                        <h6 className="mb-0 text-white">
                          {appointment.patient.name}
                        </h6>
                      </div>
                    </div>
                    <button
                      className="btn btn-gray-600 d-flex align-items-center gap-2 btn-sm mt-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewClick(appointment);
                      }}
                    >
                      <MessageSquare size={16} />
                      Chat
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card bg-gray-800 border-0 shadow-lg">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="card-title text-white">Latest Appointments</h5>
                <a
                  href="/dashboard/appointments"
                  className="text-decoration-none text-primary"
                >
                  View all →
                </a>
              </div>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr className="border-bottom border-gray-700">
                      <th style={{ color: "#9ca3af" }}>Priority</th>
                      <th style={{ color: "#9ca3af" }}>Patient</th>
                      <th style={{ color: "#9ca3af" }}>Date</th>
                      <th style={{ color: "#9ca3af" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300">
                    {appointments.map((appointment, index) => (
                      <tr key={index} className="border-bottom border-gray-700">
                        <td>
                          <span
                            className={`badge ${
                              appointment.priority === "high"
                                ? "bg-red-900 text-red-300"
                                : "bg-yellow-900 text-yellow-300"
                            }`}
                          >
                            {appointment.priority}
                          </span>
                        </td>
                        <td style={{ color: "#ffffff" }}>
                          {appointment.patient.name}
                        </td>{" "}
                        {/* Change color here for patient name */}
                        <td style={{ color: "#9ca3af" }}>
                          {appointment.date + " " + appointment.time}
                        </td>
                        <td>
                          <span className="badge bg-yellow-900 text-yellow-300">
                            {appointment.appointmentStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bg-gray-900 {
          background-color: #111827;
        }
        .bg-gray-800 {
          background-color: #1f2937;
        }
        .bg-gray-700 {
          background-color: #374151;
        }
        .text-gray-300 {
          color: #d1d5db;
        }
        .text-gray-400 {
          color: #9ca3af;
        }
        .border-gray-700 {
          border-color: #374151 !important;
        }

        .container-fluid {
          background-color: #111827 !important;
        }

        .card {
          transition: transform 0.2s ease-in-out;
        }

        .card:hover {
          transform: translateY(-2px);
        }

        .table-hover tbody tr:hover {
          background-color: #374151 !important;
        }

        .btn-gray-700 {
          background-color: #374151;
          border: none;
        }

        .btn-gray-700:hover {
          background-color: #4b5563;
        }
        .table {
          color: #d1d5db !important;
        }

        .table > :not(caption) > * > * {
          background-color: transparent;
          border-color: #374151;
        }

        .table tbody tr:hover {
          background-color: rgba(55, 65, 81, 0.3) !important;
          color: #f3f4f6 !important;
        }

        .bg-red-900 {
          background-color: rgba(127, 29, 29, 0.4);
        }

        .bg-yellow-900 {
          background-color: rgba(120, 53, 15, 0.4);
        }

        .text-red-300 {
          color: #fca5a5;
        }

        .text-yellow-300 {
          color: #fcd34d;
        }
        .btn-gray-600 {
          background-color: #4b5563;
          border: none;
          color: #d1d5db;
        }
        .btn-gray-600:hover {
          background-color: #6b7280;
          color: #f3f4f6;
        }
      `}</style>
    </div>
  );
};

export default Overview;
