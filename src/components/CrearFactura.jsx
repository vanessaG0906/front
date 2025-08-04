import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext"; // ⬅️ NUEVO

const API_BASE_URL = "http://localhost:8000/api";

export default function CrearFactura() {
  const { id } = useParams(); // ID de la reserva
  const { user } = useAuthContext(); // ⬅️ NUEVO
  const [reserva, setReserva] = useState(null);
  const [detalleReservas, setDetalleReservas] = useState([]);
  const [clienteId, setClienteId] = useState(null);
  const [usuarioId, setUsuarioId] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [descuento, setDescuento] = useState(0);

  useEffect(() => {
    const fetchReserva = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/reservas/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const data = await response.json();
        if (response.ok) {
          setReserva(data);
          setClienteId(data.cliente_id);
        } else {
          console.error("Error al cargar reserva");
        }
      } catch (error) {
        console.error("Error de red", error);
      }
    };

    const fetchDetalles = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/reservas/${id}/servicios`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const data = await response.json();
        if (response.ok) {
          setDetalleReservas(data);
        } else {
          console.error("Error al cargar detalles");
        }
      } catch (error) {
        console.error("Error de red", error);
      }
    };

    // ✅ Usar el ID del usuario desde el contexto
    if (user?.id) {
      setUsuarioId(user.id);
      console.log("Usuario desde contexto:", user);
    }

    fetchReserva();
    fetchDetalles();
  }, [id, user]);

  const calcularSubtotal = () => {
    return detalleReservas.reduce((total, item) => total + parseFloat(item.precio_total), 0);
  };

  const subtotal = calcularSubtotal();
  const impuesto = subtotal * 0.12;
  const total = subtotal + impuesto - descuento;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    console.log("usuarioId antes de enviar:", usuarioId);

    if (!usuarioId) {
      setMensaje("Error: usuario no autenticado (usuarioId faltante).");
      return;
    }

    if (!reserva) {
      setMensaje("No se ha cargado la reserva");
      return;
    }

    const tipo_reserva = reserva.tipo_reserva;
    let id_objeto = reserva.id_mesa || reserva.id_habitacion || reserva.id_salon;

    const factura = {
      cliente_id: clienteId,
      usuario_id: usuarioId,
      reserva_ids: [reserva.id],
      reservas: [
        {
          tipo_reserva,
          id_objeto,
          fecha_inicio: reserva.fecha_inicio,
          fecha_fin: reserva.fecha_fin,
        },
      ],
      servicios_extra: detalleReservas.map((item) => ({
        servicio_id: item.servicio_id,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
        precio_total: item.precio_total,
      })),
      descuento: Number(descuento),
    };

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/facturas/consolidar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(factura),
      });

      const data = await response.json();
      console.log("Respuesta creación factura:", data);

      if (!response.ok) {
        setMensaje(data.message || "Error al registrar factura");
        return;
      }

      const responseReserva = await fetch(`${API_BASE_URL}/reservas/${reserva.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ estado: "confirmado" }),
      });

      if (!responseReserva.ok) {
        setMensaje("Factura registrada, pero error al actualizar estado de reserva");
        return;
      }

      setReserva((prev) => ({ ...prev, estado: "confirmado" }));
      setMensaje("Factura registrada y reserva confirmada correctamente.");
    } catch (error) {
      console.error(error);
      setMensaje("Error de red o servidor");
    }
  };

  return (
    <div className="factura-container">
      <h2>Crear Factura</h2>

      {mensaje && <p style={{ color: "red" }}>{mensaje}</p>}

      {reserva && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Cliente ID:</label>
            <input type="text" value={clienteId || ""} readOnly />
          </div>
          <div>
            <label>Usuario ID:</label>
            <input type="text" value={usuarioId || ""} readOnly />
          </div>
          <div>
            <label>Subtotal:</label>
            <input type="text" value={subtotal.toFixed(2)} readOnly />
          </div>
          <div>
            <label>Impuesto (12%):</label>
            <input type="text" value={impuesto.toFixed(2)} readOnly />
          </div>
          <div>
            <label>Descuento:</label>
            <input
              type="number"
              value={descuento}
              onChange={(e) => setDescuento(parseFloat(e.target.value) || 0)}
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label>Total:</label>
            <input type="text" value={total.toFixed(2)} readOnly />
          </div>
          <button type="submit">Registrar Factura</button>
        </form>
      )}
    </div>
  );
}
