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

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }) => (
    <div className={`card bg-${color || "primary"} text-white mb-3`}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="card-subtitle text-white-50">{title}</h6>
          <div className="rounded-circle p-2 bg-white bg-opacity-25">
            <Icon size={20} />
          </div>
        </div>
        <h2 className="card-title mb-2">{value}</h2>
        {trend && (
          <small className={`d-flex align-items-center ${trend === "up" ? "text-success" : "text-danger"}`}>
            {trend === "up" ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            {trendValue} Since last month
          </small>
        )}
      </div>
    </div>
  );

  return (
    <div className="container-fluid bg-dark text-white" style={{ marginTop: "80px", minHeight: "100vh" }}>
      <div className="row g-4 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard title="Total Patients" value="24" icon={Users} trend="up" trendValue="12%" color="warning" />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard title="Total Doctors" value="16" icon={Calendar} trend="down" trendValue="16%" color="info" />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard title="Pending Doctors Approvals" value="10" icon={PinIcon} color="primary" />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard title="New Patients" value="6" icon={Clock} color="success" />
        </div>
      </div>

      <div className="row mb-4 g-3">
        <div className="col-md-8">
          <div className="card bg-secondary bg-opacity-10 text-white border-0">
            <div className="card-body">
              <h5 className="card-title">Doctors Overview</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "rgba(33, 37, 41, 0.9)", 
                      border: "none", 
                      color: "#f8f9fa" 
                    }} 
                    labelStyle={{ color: "#f8f9fa" }} 
                  />
                  <Bar dataKey="value" fill="#60A5FA" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-secondary bg-opacity-10 text-white border-0">
            <div className="card-body">
              <h5 className="card-title">Doctors Status</h5>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie 
                    data={trafficData} 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={80} 
                    dataKey="value"
                  >
                    {trafficData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `${value}%`}
                    contentStyle={{ 
                      backgroundColor: "rgba(33, 37, 41, 0.9)", 
                      border: "none", 
                      color: "#f8f9fa" 
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="row mb-4 g-3">
        <div className="col-md-8">
          <div className="card bg-secondary bg-opacity-10 text-white border-0">
            <div className="card-body">
              <h5 className="card-title">Patients Overview</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "rgba(33, 37, 41, 0.9)", 
                      border: "none", 
                      color: "#f8f9fa" 
                    }} 
                    labelStyle={{ color: "#f8f9fa" }} 
                  />
                  <Bar dataKey="value" fill="#60A5FA" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-secondary bg-opacity-10 text-white border-0">
            <div className="card-body">
              <h5 className="card-title">Patients Status</h5>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie 
                    data={trafficData} 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={80} 
                    dataKey="value"
                  >
                    {trafficData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `${value}%`}
                    contentStyle={{ 
                      backgroundColor: "rgba(33, 37, 41, 0.9)", 
                      border: "none", 
                      color: "#f8f9fa" 
                    }}
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