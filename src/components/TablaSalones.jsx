import "./Sidebar.css";

export default function TablaHoteles() {

 return (
    <div className="hotel-panel">
      <div className="panel-arrow">
        <i className="arrow-icon"></i>
      </div>
      <div className="panel-content">
        <h2>Salones</h2>
        <p>Contenido de Salones.</p>
        <div className="data-source">
          {/* Aquí puedes mostrar información sobre la fuente de datos */}
          <p>Datos obtenidos de: /api/salones</p>
        </div>
      </div>
    </div>
  );
}
