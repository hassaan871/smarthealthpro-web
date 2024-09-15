import React, { useState } from 'react';
import { FiUser } from 'react-icons/fi';
import './Nav.css';

const Nav = () => {
  const [activeItem, setActiveItem] = useState('Home');

  const navItems = ['Home', 'Services', 'Contact us', 'Our projects'];

  return (
    <nav className="nav-container">
      <div className="nav-content">
        <h1 className="nav-title">SmartHealthPro</h1>
        <ul className="nav-list">
          {navItems.map((item) => (
            <li key={item} className={`nav-item ${activeItem === item ? 'active' : ''}`}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveItem(item);
                }}
              >
                {item}
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