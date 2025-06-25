import "./Sidebar.css";

export default function TablaHabitaciones() {

 return (
    <div className="hotel-panel">
      <div className="panel-arrow">
        <i className="arrow-icon"></i>
      </div>
      <div className="panel-content">
        <h2>Habitaciones</h2>
        <p>Contenido de Habitaciones.</p>
        <div className="data-source">
          {/* Aquí puedes mostrar información sobre la fuente de datos */}
          <p>Datos obtenidos de: /api/habitacion</p>
        </div>
      </div>
    </div>
  );
}
