import React, { useEffect } from "react";
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
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Calendar,
  Clock,
  PinIcon,
} from "lucide-react";
import AdminNavbar from "./AdminNavbar";

const AdminOverview = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top
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
    { name: "Completed", value: 63, color: "#10B981" },
    { name: "Pending", value: 15, color: "#F59E0B" },
    { name: "TBD", value: 22, color: "#60A5FA" },
  ];
  const COLORS = ["#60A5FA", "#F59E0B", "#10B981"];

  const customStyles = `
  .overview-container {
    background: #1a1a1a;
    min-height: 100vh;
    padding: 2rem;
  }

  .stat-card {
    background: #2a2a2a;
    border: 1px solid #404040;
    border-radius: 12px;
    padding: 1.5rem;
    transition: all 0.3s ease;
  }

  .stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  .icon-container {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .trend-indicator {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.875rem;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
  }

  .trend-up {
    background: rgba(16, 185, 129, 0.1);
    color: #10B981;
  }

  .trend-down {
    background: rgba(239, 68, 68, 0.1);
    color: #EF4444;
  }


   .chart-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #ffffff;  /* Bright white for maximum contrast */
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #404040;
    letter-spacing: 0.5px; /* Improve readability */
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2); /* Add subtle shadow for better contrast */
  }

  .chart-card {
    background: #2a2a2a;
    border: 1px solid #404040;
    border-radius: 12px;
    padding: 2rem;  /* Increased padding */
    height: 100%;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  /* Add this new style for XAxis and YAxis labels */
  .recharts-text {
    fill: #ffffff !important;  /* Make axis labels white */
    font-size: 12px;
  }

  /* Add style for chart backgrounds */
  .recharts-wrapper {
    background: transparent;
  }
`;

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }) => (
    <div className="stat-card">
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h3 className="text-4xl font-bold text-white mb-2">{value}</h3>
          <p className="text-white text-lg font-medium">{title}</p>
        </div>
        <div className={`icon-container bg-${color} bg-opacity-10`}>
          <Icon size={24} className={`text-${color}`} />
        </div>
      </div>
      {trend && (
        <div
          className={`trend-indicator ${
            trend === "up" ? "trend-up" : "trend-down"
          }`}
        >
          {trend === "up" ? (
            <ArrowUpRight size={16} />
          ) : (
            <ArrowDownRight size={16} />
          )}
          {trendValue} vs last month
        </div>
      )}
    </div>
  );

  return (
    <div>
      <style>{customStyles}</style>
      <AdminNavbar />
      <div className="overview-container">
        <div className="container-fluid">
          {/* Stats Row */}
          <div className="row g-4 mb-4">
            <div className="col-12 col-sm-6 col-lg-3">
              <StatCard
                title="Total Patients"
                value="24"
                icon={Users}
                trend="up"
                trendValue="12%"
                color="primary"
              />
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <StatCard
                title="Total Doctors"
                value="16"
                icon={Calendar}
                trend="down"
                trendValue="16%"
                color="info"
              />
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <StatCard
                title="Pending Approvals"
                value="10"
                icon={PinIcon}
                color="warning"
              />
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <StatCard
                title="New Patients"
                value="6"
                icon={Clock}
                trend="up"
                trendValue="8%"
                color="success"
              />
            </div>
          </div>

          {/* Charts Row - Doctors */}
          <div className="row g-4 mb-4">
            <div className="col-md-8">
              <div className="chart-card">
                <h2 className="chart-title">Doctors Overview</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData}>
                    <XAxis dataKey="name" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#2a2a2a",
                        border: "1px solid #404040",
                        borderRadius: "8px",
                        color: "#e0e0e0",
                      }}
                    />
                    <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="col-md-4">
              <div className="chart-card">
                <h5 className="chart-title">Doctors Status</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={trafficData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {trafficData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#2a2a2a",
                        border: "1px solid #404040",
                        borderRadius: "8px",
                        color: "#e0e0e0",
                      }}
                      labelStyle={{ color: "#e0e0e0" }} // This styles the title/label
                      itemStyle={{ color: "#e0e0e0" }} // This styles the items text
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Charts Row - Patients */}
          {/* Charts Row - Patients */}
          <div className="row g-4">
            <div className="col-md-8">
              <div className="chart-card">
                <h5 className="chart-title">Patients Overview</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData}>
                    <XAxis dataKey="name" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#2a2a2a",
                        border: "1px solid #404040",
                        borderRadius: "8px",
                        color: "#e0e0e0",
                      }}
                    />
                    <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="col-md-4">
              <div className="chart-card">
                <h5 className="chart-title">Patients Status</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={trafficData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {trafficData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#2a2a2a",
                        border: "1px solid #404040",
                        borderRadius: "8px",
                        color: "#e0e0e0",
                      }}
                      labelStyle={{ color: "#e0e0e0" }} // This styles the title/label
                      itemStyle={{ color: "#e0e0e0" }} // This styles the items text
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminOverview;
