import React,{useState} from 'react';
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

    const [activeBlock, setActiveBlock] = useState(null);
  
    const handleBlockClick = (blockType) => {
      setActiveBlock(blockType);
    };
  

  return (
    <div className="DoctorDashboard-container">
      <div className="DoctorDashboard-sidebar">
        <div className="DoctorDashboard-profile">
          <img src="/api/placeholder/100/100" alt="Doctor" className="DoctorDashboard-profile-picture" />
          <h2>JOHN DON</h2>
          <p>johndon@company.com</p>
        </div>
        <nav>
          <a href="#" className="active"><Home size={20} /> Home</a>
          <a href="#"><File size={20} /> Appointments</a>
          <a href="#"><Mail size={20} /> Messages</a>
          <a href="#"><Bell size={20} /> Notifications</a>
          <a href="#"><MapPin size={20} /> Patients</a>
          <a href="#"><PieChart size={20} /> Graph</a>
        </nav>
      </div>
      <div className="DoctorDashboard-main-content">
        <header>
          <h1>Dashboard User</h1>
          <button className="DoctorDashboard-menu-toggle">☰</button>
        </header>
        {/* <div className="DoctorDashboard-stats-row">
          <div className="DoctorDashboard-stat-card primary">
            <span>Earning</span>
            <h3>$ 628</h3>
            <span className="DoctorDashboard-icon">$</span>
          </div>
          <div className="DoctorDashboard-stat-card">
            <span>Share</span>
            <h3>2434</h3>
            <span className="DoctorDashboard-icon">
              <Mail size={20} />
            </span>
          </div>
          <div className="DoctorDashboard-stat-card">
            <span>Likes</span>
            <h3>1259</h3>
            <span className="DoctorDashboard-icon">👍</span>
          </div>
          <div className="DoctorDashboard-stat-card">
            <span>Rating</span>
            <h3>8,5</h3>
            <span className="DoctorDashboard-icon">⭐</span>
          </div>
        </div> */}
        <div className="DoctorDashboard-stats-row">
      <div
        className={`DoctorDashboard-stat-card ${activeBlock === 'earning' ? 'active' : ''}`}
        onClick={() => handleBlockClick('earning')}
      >
        <span>Appointments</span>
        <h3>Overview</h3>
        <span className="DoctorDashboard-icon">$</span>
      </div>
      <div
        className={`DoctorDashboard-stat-card ${activeBlock === 'share' ? 'active' : ''}`}
        onClick={() => handleBlockClick('share')}
      >
        <span>Patients</span>
        <h3>All Time</h3>
        <span className="DoctorDashboard-icon">
          <Mail size={20} />
        </span>
      </div>
      <div
        className={`DoctorDashboard-stat-card ${activeBlock === 'like' ? 'active' : ''}`}
        onClick={() => handleBlockClick('like')}
      >
        <span>Likes</span>
        <h3>1259</h3>
        <span className="DoctorDashboard-icon">👍</span>
      </div>
      {/* <div
        className={`DoctorDashboard-stat-card ${activeBlock === 'rating' ? 'active' : ''}`}
        onClick={() => handleBlockClick('rating')}
      >
        <span>Rating</span>
        <h3>4/5</h3>
        <span className="DoctorDashboard-icon">⭐</span>
      </div>
    </div>
        <div className="DoctorDashboard-charts-row">
          <div className="DoctorDashboard-chart-card large">
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
            <button className="DoctorDashboard-check-now">Check Now</button>
          </div>
          <div className="DoctorDashboard-chart-card">
            <h3>Appointment Status</h3>
            <div className="DoctorDashboard-donut-chart">
              <svg viewBox="0 0 36 36" className="DoctorDashboard-circular-chart">
                <path className="DoctorDashboard-circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="DoctorDashboard-circle" strokeDasharray="75, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <text x="18" y="20.35" className="DoctorDashboard-percentage">45%</text>
              </svg>
            </div>
            <ul className="DoctorDashboard-legend">
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
            </ul>
            <button className="DoctorDashboard-check-now">Check Now</button>
          </div>
        </div>
        <div className="DoctorDashboard-appointment-trends">
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
          </ResponsiveContainer>*/}
          
        </div> 
      </div> 
    </div>
  );
};

export default DoctorDashboard;

