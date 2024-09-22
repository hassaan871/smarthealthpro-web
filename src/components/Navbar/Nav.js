import React, { useState } from 'react';
import { FiUser, FiCalendar, FiUsers, FiSettings, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './Nav.css';

const Nav = ({ setActiveSection }) => {
  const [activeItem, setActiveItem] = useState('Appointments');
  const navigate = useNavigate();

  const navItems = [
    { name: 'Appointments', icon: FiCalendar },
    { name: 'Patients', icon: FiUsers },
    { name: 'Profile', icon: FiSettings },
    { name: 'Log out', icon: FiLogOut },
  ];

  const logoutHandler = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="nav-container">
      <div className="nav-content">
        <h1 className="nav-title">SmartHealthPro</h1>
        <ul className="nav-list">
          {navItems.map((item) => (
            <li
              key={item.name}
              className={`nav-item ${activeItem === item.name ? 'active' : ''}`}
            >
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveItem(item.name);
                  if (item.name === 'Log out') {
                    logoutHandler();
                  } else {
                    setActiveSection(item.name);
                  }
                }}
              >
                <item.icon className="nav-icon" />
                {item.name}
              </a>
            </li>
          ))}
        </ul>
        <div className="nav-user-icon">
          <FiUser size={24} />
        </div>
      </div>
    </nav>
  );
};

export default Nav;