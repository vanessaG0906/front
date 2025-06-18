import { useLocation } from "react-router-dom";

export default function TablaHoteles() {
  const location = useLocation();

  const arrowPositions = {
    "/dashboard/hoteles": "50px",
    "/dashboard/habitaciones": "100px",
    "/dashboard/salones": "150px",
    "/dashboard/roles": "200px",
    "/dashboard/empleados": "250px",
    "/dashboard/usuarios": "300px",
  };

  const arrowTop = arrowPositions[location.pathname] || "50px";

  return (
    <div className="centered-card">
      <div className="arrow-box" style={{ "--arrow-top": arrowTop }}>
        <h2>Hoteles</h2>
        <p>Contenido de hoteles.</p>
      </div>
    </div>
  );
}
