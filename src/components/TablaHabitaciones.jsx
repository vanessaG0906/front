import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import "./TablaHabitaciones.css";

export default function TablaHabitaciones() {
  const [showForm, setShowForm] = useState(false);
  const [numero, setNumero] = useState("");
  const [tipo, setTipo] = useState("");
  const [estado, setEstado] = useState("");
  const [precioNoche, setPrecioNoche] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [habitaciones, setHabitaciones] = useState([]); // aquí guardamos las habitaciones creadas

  // useEffect para cargar habitaciones al montar el componente
  useEffect(() => {
    fetchHabitaciones();
  }, []);

  const fetchHabitaciones = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/habitaciones");
      if (response.ok) {
        const data = await response.json();
        setHabitaciones(data);
      } else {
        setMensaje("Error al cargar habitaciones");
      }
    } catch (error) {
      setMensaje("Error de red o servidor");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      const response = await fetch("http://localhost:8000/api/habitaciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          numero,
          tipo,
          estado,
          precio_noche: precioNoche,
        }),
      });

      if (response.ok) {
        const nuevaHabitacion = await response.json();

        setHabitaciones([...habitaciones, nuevaHabitacion]); // actualiza listado en front
        setMensaje("¡Habitación creada con éxito!");
        setNumero("");
        setTipo("");
        setEstado("");
        setPrecioNoche("");
        setShowForm(false);
      } else {
        const data = await response.json();
        setMensaje(data.message || "Error al crear la habitación");
      }
    } catch (error) {
      setMensaje("Error de red o servidor");
    }
  };

  return (
    <div className="hotel-panel">
      <div className="panel-arrow">
        <i className="arrow-icon"></i>
      </div>
      <div className="panel-content">
        <h2>Habitaciones</h2>
        <p>Contenido de Habitaciones.</p>
        <div className="data-source">
          <p>Datos obtenidos de: /api/habitaciones</p>
        </div>

        <button onClick={() => setShowForm(!showForm)} className="toggle-form-button">
          {showForm ? "Cancelar" : "Crear Habitación"}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className="create-habitacion-form">
            <div>
              <label>Número:</label>
              <input
                type="text"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Tipo:</label>
              <input
                type="text"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Estado:</label>
              <input
                type="text"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Precio por noche:</label>
              <input
                type="number"
                value={precioNoche}
                onChange={(e) => setPrecioNoche(e.target.value)}
                required
              />
            </div>
            <button type="submit">Guardar</button>
          </form>
        )}

        {mensaje && <p className="mensaje">{mensaje}</p>}

        <div className="habitaciones-lista">
          <h3>Habitaciones creadas:</h3>
          {habitaciones.length === 0 ? (
            <p>No hay habitaciones creadas aún.</p>
          ) : (
            <ul>
              {habitaciones.map((habitacion) => (
                <li key={habitacion.id}>
                  #{habitacion.numero} - {habitacion.tipo} - Estado: {habitacion.estado} - ${habitacion.precio_noche} por noche
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
