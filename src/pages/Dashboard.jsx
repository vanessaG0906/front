import { Routes, Route, Navigate } from "react-router-dom";
import SidebarRight from "../components/SidebarRight";
import TablaHoteles from "../components/TablaHoteles";
import TablaHabitaciones from "../components/TablaHabitaciones";
import TablaSalones from "../components/TablaSalones";
import TablaRoles from "../components/TablaRoles";
import TablaEmpleados from "../components/TablaEmpleados";
import TablaUsuarios from "../components/TablaUsuarios";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <Routes>
          <Route path="/" element={<Navigate to="hoteles" />} />
          <Route path="hoteles" element={<TablaHoteles />} />
          <Route path="habitaciones" element={<TablaHabitaciones />} />
          <Route path="salones" element={<TablaSalones />} />
          <Route path="roles" element={<TablaRoles />} />
          <Route path="empleados" element={<TablaEmpleados />} />
          <Route path="usuarios" element={<TablaUsuarios />} />
        </Routes>
      </div>
      <SidebarRight />
    </div>
  );
}