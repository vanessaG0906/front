import { useState, useEffect } from "react";

const API_USUARIOS = "http://localhost:8000/api/usuarios";
const API_ROLES = "http://localhost:8000/api/roles";

export default function TablaHoteles() {
  const [empleados, setEmpleados] = useState([]);
  const [roles, setRoles] = useState([]);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [rolId, setRolId] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  // Carga inicial: empleados y roles
  useEffect(() => {
    cargarRoles();
    cargarEmpleados();
  }, []);

  async function cargarRoles() {
    try {
      const res = await fetch(API_ROLES, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) {
        const data = await res.json();
        setRoles(data);
        if (!rolId && data.length > 0) setRolId(String(data[0].id));
      } else {
        setMensaje("Error al cargar roles");
      }
    } catch (e) {
      setMensaje("Error de red cargando roles");
    }
  }

  async function cargarEmpleados() {
    try {
      const res = await fetch(API_USUARIOS, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) {
        const data = await res.json();
        setEmpleados(data);
      } else {
        setMensaje("Error al cargar empleados");
      }
    } catch (e) {
      setMensaje("Error de red cargando empleados");
    }
  }

  const resetFormulario = () => {
    setNombre("");
    setCorreo("");
    setPassword("");
    if (roles.length > 0) setRolId(String(roles[0].id));
    else setRolId("");
    setEditandoId(null);
    setMensaje("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    const url = editandoId ? `${API_USUARIOS}/${editandoId}` : API_USUARIOS;
    const method = editandoId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          nombre,
          correo,
          ...(password ? { password } : {}),
          rol_id: rolId,
        }),
      });

      if (res.ok) {
        setMensaje(editandoId ? "Empleado actualizado." : "Empleado registrado.");
        resetFormulario();
        cargarEmpleados();
      } else {
        const data = await res.json().catch(() => ({}));
        setMensaje(data.message || "Error guardando empleado");
      }
    } catch (e) {
      setMensaje("Error de red al guardar empleado");
    }
  };

  const handleEditar = (emp) => {
    setNombre(emp.nombre);
    setCorreo(emp.correo);
    setRolId(String(emp.rol_id));
    setEditandoId(emp.id);
    setPassword("");
    setMensaje("");
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este empleado?")) return;

    try {
      const res = await fetch(`${API_USUARIOS}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (res.ok) {
        setMensaje("Empleado eliminado.");
        cargarEmpleados();
      } else {
        setMensaje("Error eliminando empleado.");
      }
    } catch {
      setMensaje("Error de red al eliminar empleado.");
    }
  };

  return (
    <div className="hotel-panel" style={{ maxWidth: 700, margin: "2rem auto", padding: "1.5rem", fontFamily: "Arial, sans-serif" }}>
      <h2>{editandoId ? "Editar Empleado" : "Registrar Empleado"}</h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "2rem" }}>
        <label>Nombre:</label>
        <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required />

        <label>Correo:</label>
        <input type="email" value={correo} onChange={e => setCorreo(e.target.value)} required disabled={!!editandoId} />

        <label>
          Contraseña: {editandoId && <small>(dejar vacío para no cambiar)</small>}
        </label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          {...(!editandoId ? { required: true } : {})}
        />

        <label>Rol:</label>
        <select value={rolId} onChange={e => setRolId(e.target.value)} required>
          <option value="" disabled>
            -- Selecciona un rol --
          </option>
          {roles.map(rol => (
            <option key={rol.id} value={rol.id}>
              {rol.nombre}
            </option>
          ))}
        </select>

        <div style={{ marginTop: 10 }}>
          <button type="submit" style={{ padding: "8px 16px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>
            {editandoId ? "Actualizar" : "Registrar"}
          </button>

          {editandoId && (
            <button
              type="button"
              onClick={resetFormulario}
              style={{ marginLeft: 10, padding: "8px 16px", borderRadius: 6, cursor: "pointer" }}
            >
              Cancelar
            </button>
          )}
        </div>

        {mensaje && (
          <p style={{ marginTop: 10, fontWeight: "bold", color: mensaje.toLowerCase().includes("error") ? "red" : "green" }}>
            {mensaje}
          </p>
        )}
      </form>

      <h2>Empleados registrados</h2>
      {empleados.length === 0 ? (
        <p>No hay empleados registrados</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th style={{ border: "1px solid #ddd", padding: 8, textAlign: "left" }}>Nombre</th>
              <th style={{ border: "1px solid #ddd", padding: 8, textAlign: "left" }}>Correo</th>
              <th style={{ border: "1px solid #ddd", padding: 8, textAlign: "left" }}>Rol</th>
              <th style={{ border: "1px solid #ddd", padding: 8, textAlign: "left" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map(emp => (
              <tr key={emp.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: 8 }}>{emp.nombre}</td>
                <td style={{ padding: 8 }}>{emp.correo}</td>
                <td style={{ padding: 8 }}>{emp.rol_nombre || emp.rol_id}</td>
                <td style={{ padding: 8 }}>
                  <button
                    onClick={() => handleEditar(emp)}
                    style={{ marginRight: 8, cursor: "pointer", padding: "4px 8px" }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(emp.id)}
                    style={{ color: "red", cursor: "pointer", padding: "4px 8px" }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
