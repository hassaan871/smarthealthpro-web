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
import { Link } from "react-router-dom";

const Nav = () => {
  const navItems = [
    /*Set the Appripiate paths to the correct routes */
    { name: "Overview", icon: FiGrid, path: "" },
    { name: "Doctors", icon: FiCalendar, path: "" },
    { name: "Patients", icon: FiUsers, path: "" },
    { name: "Approve Doctors", icon: FiMessageSquare, path: "" },
    // { name: "Profile", icon: FiSettings, path: "/dashboard/profile" },
    { name: "Log out", icon: FiLogOut, path: "/login" },
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top" >
      <div className="container-fluid">
        <Link className="navbar-brand" to=""> {/*Route to the Admin panel Overview*/}
          Admin SmartHealthPro
        </Link>
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
              <li key={item.name} className="nav-item">
                <Link className="nav-link" to={item.path}>
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

export default Nav;
