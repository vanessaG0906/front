import React, { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext"; // Ajusta ruta según tu estructura
import "./TablaRoles.css";

const API_BASE_URL = "http://localhost:8000/api";

export default function TablaRoles() {
  const { user } = useAuthContext();

  // Cambia los nombres de los roles para que coincidan con los que tienes en user.rol
  if (!user || (user.rol !== "Administrador" && user.rol !== "Dueño")) {
    return <p style={{ padding: 20, color: "red" }}>Acceso denegado. No tienes permisos para ver esta página.</p>;
  }

  const [showForm, setShowForm] = useState(false);
  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    fetchRoles();
  }, []);

  const getToken = () => localStorage.getItem("token");

  const fetchRoles = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/roles`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          Accept: "application/json",
        },
      });
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

  const resetFormulario = () => {
    setNombre("");
    setShowForm(false);
    setError("");
    setMensaje("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    if (!nombre.trim()) {
      setError("El nombre del rol no puede estar vacío.");
      return;
    }

    if (roles.some((rol) => rol.nombre.toLowerCase() === nombre.trim().toLowerCase())) {
      setError("Ya existe un rol con ese nombre.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/roles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
          Accept: "application/json",
        },
        body: JSON.stringify({ nombre: nombre.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        setMensaje("Rol creado con éxito!");
        setRoles([...roles, data]);
        resetFormulario();
      } else {
        const data = await response.json();
        setError(data.message || "Error al crear el rol");
      }
    } catch {
      setError("Error de red o servidor");
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este rol?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/roles/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        setMensaje("Rol eliminado con éxito!");
        setRoles(roles.filter((rol) => rol.id !== id));
      } else {
        const data = await response.json();
        setError(data.message || "Error al eliminar el rol");
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

        <button
          onClick={() => {
            resetFormulario();
            setShowForm(!showForm);
          }}
          className="toggle-form-button"
        >
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
                <li key={rol.id} style={{ marginBottom: 6 }}>
                  {rol.nombre}{" "}
                  <button
                    onClick={() => handleEliminar(rol.id)}
                    style={{
                      marginLeft: 10,
                      color: "red",
                      cursor: "pointer",
                      background: "none",
                      border: "none",
                    }}
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
