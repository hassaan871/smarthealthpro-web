import React from "react";
import {
  FiGrid,
  FiCalendar,
  FiUsers,
  FiMessageSquare,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = (event) => {
    event.preventDefault();
    // Clear any authentication tokens
    localStorage.removeItem("adminInfo");
    navigate("/admin/login");
  };

  const navItems = [
    {
      name: "Overview",
      icon: FiGrid,
      path: "/admin/overview",
    },
    {
      name: "Doctors",
      icon: FiCalendar,
      path: "/admin/doctors",
    },
    {
      name: "Patients",
      icon: FiUsers,
      path: "/admin/patients",
    },
    {
      name: "Approve Doctors",
      icon: FiMessageSquare,
      path: "/admin/approve",
    },
    {
      name: "Log out",
      icon: FiLogOut,
      path: "/admin/login",
      onClick: handleLogout,
    },
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/admin/overview">
          Admin SmartHealthPro
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#adminNavbar"
          aria-controls="adminNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="adminNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {navItems.map((item) => (
              <li key={item.name} className="nav-item">
                <Link
                  className="nav-link"
                  to={item.path}
                  onClick={item.onClick}
                >
                  <item.icon className="me-2" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
