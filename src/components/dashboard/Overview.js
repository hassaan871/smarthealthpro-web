import React from "react";
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
} from "lucide-react";

const Overview = () => {
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

  const patients = [
    { name: "Soniya Ahmad", updated: "2024-09-10" },
    { name: "Aftab Gul", updated: "2024-09-9" },
    { name: "Rita", updated: "2024-09-8" },
    { name: "John Doe", updated: "2024-09-7" },
  ];

  const appointments = [
    {
      priority: "high",
      patient: "Taylor Johnson",
      date: "2024-09-10",
      status: "Pending",
    },
    {
      priority: "high",
      patient: "Alex Walker",
      date: "2024-09-11",
      status: "Pending",
    },
    {
      priority: "high",
      patient: "Walter White",
      date: "2024-09-12",
      status: "Pending",
    },
    { priority: "low", patient: "Ali", date: "2024-09-13", status: "Pending" },
    {
      priority: "low",
      patient: "John Doe",
      date: "2024-09-14",
      status: "Pending",
    },
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

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "#1F2937",
            padding: "10px",
            border: "1px solid #374151",
            borderRadius: "4px",
          }}
        >
          <p style={{ color: "#F3F4F6", margin: "0" }}>
            {`${label} : ${payload[0].value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className="container-fluid p-4 bg-gray-900"
      style={{ marginTop: "75px", width: "90vw" }}
    >
      <div className="row mb-4 g-3">
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
                <a href="#" className="text-decoration-none text-primary">
                  View all →
                </a>
              </div>
              <ul className="list-group list-group-flush bg-transparent">
                {patients.map((product, index) => (
                  <li
                    key={index}
                    className="list-group-item bg-transparent border-gray-700 d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <h6 className="mb-0 text-white">{product.name}</h6>
                      <small className="text-gray-400">
                        Updated {product.updated}
                      </small>
                    </div>
                    <button className="btn btn-sm btn-gray-700">
                      <MoreVertical size={16} className="text-gray-400" />
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
                <a href="#" className="text-decoration-none text-primary">
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
                          {appointment.patient}
                        </td>{" "}
                        {/* Change color here for patient name */}
                        <td style={{ color: "#9ca3af" }}>{appointment.date}</td>
                        <td>
                          <span className="badge bg-yellow-900 text-yellow-300">
                            {appointment.status}
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
      `}</style>
    </div>
  );
};

export default Overview;
