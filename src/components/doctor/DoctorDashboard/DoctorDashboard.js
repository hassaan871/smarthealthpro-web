import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, LineChart, Line,
} from 'recharts';
import { Home, File, Mail, Bell, MapPin, PieChart } from 'lucide-react';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('appointments');

  const appointmentsData = [
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

  const shareData = [
    { name: 'JAN', share: 120 },
    { name: 'FEB', share: 210 },
    { name: 'MAR', share: 150 },
    { name: 'APR', share: 220 },
    { name: 'MAY', share: 300 },
    { name: 'JUN', share: 450 },
    { name: 'JUL', share: 500 },
    { name: 'AUG', share: 650 },
    { name: 'SEP', share: 300 },
  ];

  const likesData = [
    { name: 'JAN', likes: 400 },
    { name: 'FEB', likes: 600 },
    { name: 'MAR', likes: 500 },
    { name: 'APR', likes: 700 },
    { name: 'MAY', likes: 800 },
    { name: 'JUN', likes: 1000 },
    { name: 'JUL', likes: 1200 },
    { name: 'AUG', likes: 1400 },
    { name: 'SEP', likes: 1100 },
  ];

  const ratingData = [
    { name: 'JAN', rating: 4 },
    { name: 'FEB', rating: 3.5 },
    { name: 'MAR', rating: 4.2 },
    { name: 'APR', rating: 4.5 },
    { name: 'MAY', rating: 4.7 },
    { name: 'JUN', rating: 4.3 },
    { name: 'JUL', rating: 4.6 },
    { name: 'AUG', rating: 4.8 },
    { name: 'SEP', rating: 4.5 },
  ];

  const severityData = [
    { name: 'Mild (0-20%)', value: 30, color: '#4caf50' },
    { name: 'Moderate (20-40%)', value: 25, color: '#8bc34a' },
    { name: 'Significant (40-60%)', value: 20, color: '#ffc107' },
    { name: 'Severe (60-80%)', value: 15, color: '#ff9800' },
    { name: 'Critical (80-100%)', value: 10, color: '#f44336' },
  ];

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

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
          <div
            className={`stat-card ${selectedTab === 'appointments' ? 'primary' : ''}`}
            onClick={() => handleTabChange('appointments')}
          >
            <span>Appointments</span>
            <h3>100</h3>
            <span className="icon">📅</span>
          </div>
          <div
            className={`stat-card ${selectedTab === 'share' ? 'primary' : ''}`}
            onClick={() => handleTabChange('share')}
          >
            <span>Share</span>
            <h3>2434</h3>
            <span className="icon">
              <Mail size={20} />
            </span>
          </div>
          <div
            className={`stat-card ${selectedTab === 'likes' ? 'primary' : ''}`}
            onClick={() => handleTabChange('likes')}
          >
            <span>Likes</span>
            <h3>1259</h3>
            <span className="icon">👍</span>
          </div>
          <div
            className={`stat-card ${selectedTab === 'rating' ? 'primary' : ''}`}
            onClick={() => handleTabChange('rating')}
          >
            <span>Rating</span>
            <h3>4.5</h3>
            <span className="icon">⭐</span>
          </div>
        </div>
        <div className="charts-row">
          {selectedTab === 'appointments' && (
            <>
              <div className="chart-card large">
                <h3>Appointments Overview</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={appointmentsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="visited" fill="#1e40af" />
                    <Bar dataKey="pending" fill="#fbbf24" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-card">
                <h3>Appointment Status</h3>
                <div className="donut-chart">
                  <svg viewBox="0 0 36 36" className="circular-chart">
                    {severityData.map((severity, index) => (
                      <path
                        key={index}
                        className="circle"
                        strokeDasharray={`${severity.value}, 100`}
                        stroke={severity.color}
                        d={`M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831`}
                      />
                    ))}
                    <text x="18" y="20.35" className="percentage">{`${severityData.reduce((acc, cur) => acc + cur.value, 0)}%`}</text>
                  </svg>
                </div>
                <ul className="legend">
                  {severityData.map((severity, index) => (
                    <li key={index}>{`${severity.name}: ${severity.value} cases`}</li>
                  ))}
                </ul>
                <select className="check-now">
                  <option>Ongoing Appointments</option>
                  <option>Last 7 Days Appointments Severity Index</option>
                  <option>Last 30 Days Appointments Severity Index</option>
                  <option>Last 60 Days Appointments Severity Index</option>
                  <option>Last 90 Days Appointments Severity Index</option>
                  <option>Last 120 Days Appointments Severity Index</option>
                </select>
              </div>
            </>
          )}

          {selectedTab === 'share' && (
            <div className="chart-card large">
              <h3>Share Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={shareData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="share" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {selectedTab === 'likes' && (
            <div className="chart-card large">
              <h3>Likes Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={likesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="likes" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {selectedTab === 'rating' && (
            <div className="chart-card large">
              <h3>Rating Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={ratingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="rating" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
