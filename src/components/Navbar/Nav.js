import React, { useState } from "react";
import {
  FiUser,
  FiCalendar,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiGrid,
  FiMessageSquare,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Nav = ({ setActiveSection, activeSection }) => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("Appointments");

  const navItems = [
    { name: "Overview", icon: FiGrid, path: "/dashboard/overview" },
    { name: "Appointments", icon: FiCalendar, path: "/dashboard/appointments" },
    { name: "Patients", icon: FiUsers, path: "/dashboard/patients" },
    { name: "Chat", icon: FiMessageSquare, path: "/dashboard/chat" },
    { name: "Profile", icon: FiSettings, path: "/dashboard/profile" },
    { name: "Log out", icon: FiLogOut, path: "/login" },
  ];

  const logoutHandler = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleNavigation = (item) => {
    if (item.name === "Log out") {
      localStorage.clear();
      navigate("/login");
    } else {
      setActiveSection(item.name);
      navigate(item.path);
    }
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <a
          className="navbar-brand"
          href="/dashboard/overview"
          onClick={() => navigate("/")}
        >
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
              <li
                key={item.name}
                className={`nav-item ${
                  activeSection === item.name ? "active" : ""
                }`}
              >
                <a
                  className="nav-link"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation(item);
                  }}
                >
                  <item.icon className="me-2" />
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
