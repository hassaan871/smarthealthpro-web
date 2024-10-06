import React, { useState } from 'react';
import { FiUser, FiCalendar, FiUsers, FiSettings, FiLogOut, FiGrid } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Nav = ({ setActiveSection }) => {
  const [activeItem, setActiveItem] = useState('Appointments');
  const navigate = useNavigate();

  const navItems = [
    { name: 'Overview', icon: FiGrid },
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
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          SmartHealthPro
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {navItems.map((item) => (
              <li key={item.name} className={`nav-item ${activeItem === item.name ? 'active' : ''}`}>
                <a
                  className="nav-link"
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
                  <item.icon className="me-2" />
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
          <span className="navbar-text">
            <FiUser size={24} />
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
