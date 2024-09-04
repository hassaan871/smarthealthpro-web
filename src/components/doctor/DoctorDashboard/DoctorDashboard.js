import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Home, File, Mail, Bell, MapPin, PieChart } from 'lucide-react';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
  const appointments = [
    { id: 1, client: 'John Doe', date: '2024-08-21', time: '10:00 AM', status: 'Confirmed' },
    { id: 2, client: 'Jane Smith', date: '2024-08-22', time: '11:00 AM', status: 'Pending' },
  ];

  const monthlyData = [
    { name: 'JAN', visited: 20, pending: 10 },
    { name: 'FEB', visited: 35, pending: 15 },
    { name: 'MAR', visited: 25, pending: 20 },
    { name: 'APR', visited: 30, pending: 25 },
    { name: 'MAY', visited: 28, pending: 35 },
    { name: 'JUN', visited: 32, pending: 30 },
    { name: 'JUL', visited: 40, pending: 20 },
    { name: 'AUG', visited: 32, pending: 25 },
    { name: 'SEP', visited: 28, pending: 15 },
  ];

  const areaChartData = [
    { name: 'JAN', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'FEB', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'MAR', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'APR', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'MAY', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'JUN', uv: 2390, pv: 3800, amt: 2500 },
    { name: 'JUL', uv: 3490, pv: 4300, amt: 2100 },
  ];

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="profile">
          <img src="/api/placeholder/100/100" alt="Doctor" className="profile-picture" />
          <h2>JOHN DON</h2>
          <p>johndon@company.com</p>
        </div>
        <nav>
          <a href="#" className="active"><Home size={20} /> Home</a>
          <a href="#"><File size={20} /> File</a>
          <a href="#"><Mail size={20} /> Messages</a>
          <a href="#"><Bell size={20} /> Notification</a>
          <a href="#"><MapPin size={20} /> Location</a>
          <a href="#"><PieChart size={20} /> Graph</a>
        </nav>
      </div>
      <div className="main-content">
        <header>
          <h1>Dashboard User</h1>
          <button className="menu-toggle">☰</button>
        </header>
        <div className="stats-row">
          <div className="stat-card primary">
            <span>Earning</span>
            <h3>$ 628</h3>
            <span className="icon">$</span>
          </div>
          <div className="stat-card">
            <span>Share</span>
            <h3>2434</h3>
            <span className="icon">
              <Mail size={20} />
            </span>
          </div>
          <div className="stat-card">
            <span>Likes</span>
            <h3>1259</h3>
            <span className="icon">👍</span>
          </div>
          <div className="stat-card">
            <span>Rating</span>
            <h3>8,5</h3>
            <span className="icon">⭐</span>
          </div>
        </div>
        <div className="charts-row">
          <div className="chart-card large">
            <h3>Result</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="visited" fill="#1e40af" />
                <Bar dataKey="pending" fill="#fbbf24" />
              </BarChart>
            </ResponsiveContainer>
            <button className="check-now">Check Now</button>
          </div>
          <div className="chart-card">
            <h3>Appointment Status</h3>
            <div className="donut-chart">
              <svg viewBox="0 0 36 36" className="circular-chart">
                <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="circle" strokeDasharray="75, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <text x="18" y="20.35" className="percentage">45%</text>
              </svg>
            </div>
            <ul className="legend">
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
            </ul>
            <button className="check-now">Check Now</button>
          </div>
        </div>
        <div className="appointment-trends">
          <h3>Appointment Trends</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={areaChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="uv" stackId="1" stroke="#fbbf24" fill="#fde68a" />
              <Area type="monotone" dataKey="pv" stackId="1" stroke="#1e40af" fill="#3b82f6" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;