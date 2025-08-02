import { useState } from "react";
import "./Sidebar.css";

const API_BASE_URL = "http://localhost:8000/api";

export default function CrearCliente() {
  const [nombre, setNombre] = useState("");
  const [cedula, setCedula] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      const response = await fetch(`${API_BASE_URL}/clientes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ nombre, cedula, telefono }), // Cambié correo por cedula
      });

      if (response.ok) {
        setMensaje("Cliente registrado con éxito");
        setNombre("");
        setCedula("");
        setTelefono("");
      } else {
        const data = await response.json();
        setMensaje(data.message || "Error al registrar cliente");
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
        <h2>Registrar Cliente</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nombre:</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Cédula:</label>
            <input
              type="text"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Teléfono:</label>
            <input
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
            />
          </div>
          <button type="submit">Registrar</button>
        </form>
        {mensaje && <p>{mensaje}</p>}
      </div>
    </div>
  );
}
