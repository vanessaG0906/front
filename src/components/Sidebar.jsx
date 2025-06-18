import { NavLink } from "react-router-dom";
import {
  FaHotel,
  FaBed,
  FaUsers,
  FaUserTie,
  FaChair,
  FaUserShield
} from "react-icons/fa";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <NavLink to="/dashboard/hoteles" className="sidebar-btn">
          <FaHotel /> <span>Hoteles</span>
        </NavLink>
        <NavLink to="/dashboard/habitaciones" className="sidebar-btn">
          <FaBed /> <span>Habitaciones</span>
        </NavLink>
        <NavLink to="/dashboard/salones" className="sidebar-btn">
          <FaChair /> <span>Salones</span>
        </NavLink>
        <NavLink to="/dashboard/roles" className="sidebar-btn">
          <FaUserShield /> <span>Roles</span>
        </NavLink>
        <NavLink to="/dashboard/empleados" className="sidebar-btn">
          <FaUserTie /> <span>Empleados</span>
        </NavLink>
        <NavLink to="/dashboard/usuarios" className="sidebar-btn">
          <FaUsers /> <span>Usuarios</span>
        </NavLink>
      </nav>
    </aside>
  );
}
