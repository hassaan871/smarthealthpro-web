import React from 'react';
import './Nav.css';

const Nav = () => {
  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li className="nav-item">Appointments</li>
        <li className="nav-item">Patients</li>
        <li className="nav-item">Profile</li>
        <li className="nav-item">Logout</li>
      </ul>
    </nav>
  );
}

export default Nav;
