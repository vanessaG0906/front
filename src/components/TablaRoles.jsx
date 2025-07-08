import React, { useState, useEffect } from "react";
import "./Sidebar.css";

export default function TablaRoles() {
  const [showForm, setShowForm] = useState(false);
  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:8000/api/roles");
      if (response.ok) {
        const data = await response.json();
        setRoles(data);
      } else {
        setError("Error al cargar roles");
      }
    } catch {
      setError("Error de red o servidor");
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    // Validación simple: no vacío
    if (!nombre.trim()) {
      setError("El nombre del rol no puede estar vacío.");
      return;
    }
    // Validar duplicado
    if (roles.some((rol) => rol.nombre.toLowerCase() === nombre.trim().toLowerCase())) {
      setError("Ya existe un rol con ese nombre.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/roles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ nombre: nombre.trim() }),
      });

      if (response.ok) {
        const nuevoRol = await response.json();
        setRoles([...roles, nuevoRol]);
        setMensaje("¡Rol creado con éxito!");
        setNombre("");
        setShowForm(false);
      } else {
        const data = await response.json();
        setError(data.message || "Error al crear el rol");
      }
    } catch {
      setError("Error de red o servidor");
    }
  };

  return (
    <div className="hotel-panel">
      <div className="panel-arrow">
        <i className="arrow-icon"></i>
      </div>
      <div className="panel-content">
        <h2>Roles</h2>
        <p>Contenido de Roles.</p>
        <div className="data-source">
          <p>Datos obtenidos de: /api/roles</p>
        </div>

        <button onClick={() => setShowForm(!showForm)} className="toggle-form-button">
          {showForm ? "Cancelar" : "Crear Rol"}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className="create-habitacion-form">
            <div>
              <label>Nombre del rol:</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                autoFocus
                required
              />
            </div>
            <button type="submit">Guardar</button>
          </form>
        )}

        {loading && <p>Cargando roles...</p>}

        {mensaje && <p className="mensaje">{mensaje}</p>}
        {error && <p className="error">{error}</p>}

        <div className="habitaciones-lista">
          <h3>Roles creados:</h3>
          {roles.length === 0 && !loading ? (
            <p>No hay roles creados aún.</p>
          ) : (
            <ul>
              {roles.map((rol) => (
                <li key={rol.id}>{rol.nombre}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
