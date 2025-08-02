import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import "./TablaHabitaciones.css";

const API_BASE_URL = "http://localhost:8000";

export default function TablaHabitaciones() {
  const [showForm, setShowForm] = useState(false);
  const [numero, setNumero] = useState("");
  const [tipo, setTipo] = useState("");
  const [estado, setEstado] = useState("");
  const [precioNoche, setPrecioNoche] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [habitaciones, setHabitaciones] = useState([]);

  useEffect(() => {
    fetchHabitaciones();
  }, []);

  const fetchHabitaciones = async () => {
    const token = localStorage.getItem("token"); 

    try {
      const response = await fetch(`${API_BASE_URL}/api/habitaciones`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setHabitaciones(data);
      } else {
        setMensaje("Error al cargar habitaciones (¿token inválido?)");
      }
    } catch (error) {
      setMensaje("Error de red o servidor");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    const token = localStorage.getItem("token"); 

    try {
      const response = await fetch(`${API_BASE_URL}/api/habitaciones`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
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
        setHabitaciones([...habitaciones, nuevaHabitacion]);
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
        <div className="data-source">
          
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="toggle-form-button"
        >
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
               <div className="estado-container">
                <label>Estado:</label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                required
              >
                
                <option value="disponible">Disponible</option>
                <option value="ocupada">Ocupada</option>
                <option value="mantenimiento">Mantenimiento</option>
              </select>
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
                  #{habitacion.numero} - {habitacion.tipo} - Estado:{" "}
                  {habitacion.estado} - ${habitacion.precio_noche} por noche
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
