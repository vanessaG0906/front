import { useEffect, useState } from "react";
import "./Sidebar.css";

export default function Index() {
  const [reservas, setReservas] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const obtenerReservas = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/reservas");
        const data = await response.json();

        const confirmadas = data.filter(
          (reserva) =>
            reserva.estado === "confirmado" &&
            reserva.fecha === fechaSeleccionada
        );
        setReservas(confirmadas);
      } catch (error) {
        console.error("Error al obtener reservas:", error);
      }
    };

    obtenerReservas();
  }, [fechaSeleccionada]);

  const renderTabla = (tipo, titulo) => {
    const filtradas = reservas.filter((r) => r.tipo === tipo);

    return (
      <div className="seccion-tabla">
        <h3>{titulo}</h3>
        {filtradas.length === 0 ? (
          <p className="sin-reservas">No hay {tipo}s reservados</p>
        ) : (
          <table className="reserva-tabla">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Detalle</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map((reserva) => (
                <tr key={reserva.id}>
                  <td>{reserva.cliente}</td>
                  <td>{reserva.fecha}</td>
                  <td>{reserva.hora}</td>
                  <td>{reserva.detalle || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  };

  return (
    <div className="hotel-panel">
      <div className="panel-encabezado">
        <h1>Panel de Reservas del Hotel</h1>
        <div className="selector-fecha">
          <label htmlFor="fecha">Selecciona una fecha:</label>
          <input
            id="fecha"
            type="date"
            value={fechaSeleccionada}
            onChange={(e) => setFechaSeleccionada(e.target.value)}
          />
        </div>
      </div>

      <div className="panel-reservas">
        {renderTabla("mesa", "Mesas Reservadas")}
        {renderTabla("habitacion", "Habitaciones Reservadas")}
        {renderTabla("salon", "Salones Reservados")}
      </div>
    </div>
  );
}
