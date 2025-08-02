import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:8000/api";

export default function CrearReserva() {
  const [clientes, setClientes] = useState([]);
  const [tipoReserva, setTipoReserva] = useState("");
  const [salones, setSalones] = useState([]);
  const [mesas, setMesas] = useState([]);
  const [habitaciones, setHabitaciones] = useState([]);
  const [clienteId, setClienteId] = useState("");
  const [idObjeto, setIdObjeto] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [reservas, setReservas] = useState([]);
  const navigate = useNavigate();

  // Cargar datos iniciales: clientes, salones, mesas, habitaciones, reservas
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchData = async () => {
      try {
        const [resClientes, resSalones, resMesas, resHabitaciones, resReservas] = await Promise.all([
          fetch(`${API_BASE_URL}/clientes`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/salones`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/mesas`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/habitaciones`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/reservas`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (resClientes.ok) setClientes(await resClientes.json());
        if (resSalones.ok) setSalones(await resSalones.json());
        if (resMesas.ok) setMesas(await resMesas.json());
        if (resHabitaciones.ok) setHabitaciones(await resHabitaciones.json());
        if (resReservas.ok) setReservas(await resReservas.json());
      } catch (error) {
        setMensaje("Error cargando datos iniciales");
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    if (!clienteId) {
      setMensaje("Seleccione un cliente");
      return;
    }
    if (!tipoReserva) {
      setMensaje("Seleccione tipo de reserva");
      return;
    }
    if (!idObjeto) {
      setMensaje("Seleccione la habitación o mesa");
      return;
    }
    if (!fechaInicio || !fechaFin) {
      setMensaje("Seleccione fechas válidas");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/reservas`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cliente_id: clienteId,
          tipo_reserva: tipoReserva,
          id_objeto: idObjeto,
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          estado: "pendiente",
        }),
      });

      if (response.ok) {
        const nuevaReserva = await response.json();
        setReservas((prev) => [...prev, nuevaReserva]);
        setMensaje("Reserva creada con éxito");
        // Reset formulario
        setClienteId("");
        setTipoReserva("");
        setIdObjeto("");
        setFechaInicio("");
        setFechaFin("");
      } else {
        const errorData = await response.json();
        setMensaje(errorData.message || "Error al crear la reserva");
      }
    } catch {
      setMensaje("Error de red o servidor");
    }
  };

  const handleConfirmarPago = (reservaId) => {
    // Asume que tienes una ruta así en react-router para crear factura
    navigate(`/factura/${reservaId}`);
  };

  return (
    <div style={{ maxWidth: 700, margin: "auto" }}>
      <h2>Crear Reserva</h2>

      {mensaje && (
        <div
          style={{
            marginBottom: 10,
            color: mensaje.startsWith("Error") ? "red" : "green",
          }}
        >
          {mensaje}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 10 }}>
          <label>Cliente:</label>
          <select
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            required
            style={{ width: "100%" }}
          >
            <option value="">-- Seleccione Cliente --</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Tipo de Reserva:</label>
          <select
            value={tipoReserva}
            onChange={(e) => {
              setTipoReserva(e.target.value);
              setIdObjeto("");
              setMensaje("");
            }}
            required
            style={{ width: "100%" }}
          >
            <option value="">-- Seleccione --</option>
            <option value="habitacion">Habitación</option>
            <option value="mesa">Mesa</option>
          </select>
        </div>

        {tipoReserva === "habitacion" && (
          <div style={{ marginBottom: 10 }}>
            <label>Habitación:</label>
            <select
              value={idObjeto}
              onChange={(e) => setIdObjeto(e.target.value)}
              required
              style={{ width: "100%" }}
            >
              <option value="">-- Seleccione Habitación --</option>
              {habitaciones.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.numero}
                </option>
              ))}
            </select>
          </div>
        )}

        {tipoReserva === "mesa" && (
          <div style={{ marginBottom: 10 }}>
            <label>Mesa:</label>
            <select
              value={idObjeto}
              onChange={(e) => setIdObjeto(e.target.value)}
              required
              style={{ width: "100%" }}
            >
              <option value="">-- Seleccione Mesa --</option>
              {mesas.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.numero}
                </option>
              ))}
            </select>
          </div>
        )}

        <div style={{ marginBottom: 10 }}>
          <label>Fecha Inicio:</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            required
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Fecha Fin:</label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            required
            style={{ width: "100%" }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "8px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Crear Reserva
        </button>
      </form>

      <hr style={{ margin: "20px 0" }} />

      <h3>Reservas creadas</h3>
      {reservas.length === 0 && <p>No hay reservas creadas aún.</p>}

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #ccc" }}>
            <th>Cliente</th>
            <th>Tipo</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reservas.map((res) => (
            <tr key={res.id} style={{ borderBottom: "1px solid #eee" }}>
              <td>{res.cliente?.nombre || "N/A"}</td>
              <td>{res.tipo_reserva}</td>
              <td>
                {res.tipo_reserva === "habitacion"
                  ? res.habitacion?.numero || "N/A"
                  : res.mesa?.numero || "N/A"}
              </td>
              <td>{res.fecha_inicio}</td>
              <td>{res.fecha_fin}</td>
              <td>{res.estado}</td>
              <td>
                {res.estado === "pendiente" && (
                  <button
                    onClick={() => handleConfirmarPago(res.id)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Confirmar Pago
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
