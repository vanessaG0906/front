import "./Sidebar.css";
const API_HOTELES = "http://localhost:8000/api/hotels";
const API_ROLES = "http://localhost:8000/api/hotels";
const API_HABITACIONES = "http://localhost:8000/api/hotels";


export default function Index() {

 return (
    <div className="hotel-panel">
      <div className="panel-arrow">
        <i className="arrow-icon"></i>
      </div>
      <div className="panel-content">
        <h2>Inicio</h2>
        <p>---------------------.</p>
        <div className="data-source">
          {/* Aquí puedes mostrar información sobre la fuente de datos */}
          <p></p>
        </div>
      </div>
    </div>
  );
}