import React from "react";
import { FaUserCircle } from "react-icons/fa";
import './Navbar.css'

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-logo">
        <span role="img" aria-label="hotel" style={{ fontSize: "2rem" }}>🏨</span>
        <span className="navbar-title">Hotel Dashboard</span>
      </div>
      <div className="navbar-user">
        <FaUserCircle size={28} />
        <span className="navbar-username">admin</span>
        <button className="navbar-logout">Cerrar sesión</button>
      </div>
    </header>
  );
}