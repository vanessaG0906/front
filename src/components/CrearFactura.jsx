import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const API_BASE_URL = "http://localhost:8000/api";

export default function CrearFactura() {
  const { id } = useParams(); // id de la reserva
  const [reserva, setReserva] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [objeto, setObjeto] = useState(null); // habitación o salón
  const [detalleReservas, setDetalleReservas] = useState([]); // servicios extra
  const [subtotal, setSubtotal] = useState(0);
  const [descuento, setDescuento] = useState(0);
  const [estadoPago, setEstadoPago] = useState("Pendiente");
  const [mensaje, setMensaje] = useState("");
  const [precioPorNoche, setPrecioPorNoche] = useState(0);

  const clienteId = cliente?.id || 1;
  const usuarioId = 1;

  // Función para calcular noches entre fecha_inicio y fecha_fin
  const calcularNoches = (inicio, fin) => {
    const parseDate = (fecha) => {
      const d = new Date(fecha);
      return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    };

    const fechaInicio = parseDate(inicio);
    const fechaFin = parseDate(fin);

    const diffTime = fechaFin.getTime() - fechaInicio.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    return diffDays > 0 ? diffDays : 1;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchDatos = async () => {
      try {
        const resReserva = await fetch(`${API_BASE_URL}/reservas/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resReserva.ok) throw new Error("Error al obtener la reserva");
        const reservaData = await resReserva.json();
        setReserva(reservaData);

        const resCliente = await fetch(`${API_BASE_URL}/clientes/${reservaData.cliente_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const clienteData = resCliente.ok ? await resCliente.json() : null;
        setCliente(clienteData);

        let objetoData = null;
        if (reservaData.tipo_reserva === "habitacion") {
          const resHabitacion = await fetch(`${API_BASE_URL}/habitaciones/${reservaData.id_objeto}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          objetoData = resHabitacion.ok ? await resHabitacion.json() : null;
        } else if (reservaData.tipo_reserva === "salon") {
          const resSalon = await fetch(`${API_BASE_URL}/salones/${reservaData.id_objeto}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          objetoData = resSalon.ok ? await resSalon.json() : null;
        }
        setObjeto(objetoData);

        const resServicios = await fetch(`${API_BASE_URL}/reservas/${id}/servicios`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resServicios.ok) throw new Error("Error al obtener servicios extra");
        const serviciosData = await resServicios.json();
        setDetalleReservas(serviciosData);

      } catch (error) {
        console.error(error);
        setMensaje(error.message);
      }
    };

    fetchDatos();
  }, [id]);

  useEffect(() => {
    if (!reserva || !objeto) return;

    const noches = calcularNoches(reserva.fecha_inicio, reserva.fecha_fin);
    const pPrecioPorNoche = parseFloat(objeto.precio_noche) || 0;
    setPrecioPorNoche(pPrecioPorNoche);

    let precioObjeto = 0;

    if (reserva.tipo_reserva === "habitacion") {
      precioObjeto = pPrecioPorNoche * noches;
    } else if (reserva.tipo_reserva === "salon") {
      precioObjeto = parseFloat(objeto.precio_alquiler) || 0;
    }

    const sumaServicios = detalleReservas.reduce(
      (acc, item) => acc + Number(item.precio_total || 0),
      0
    );

    setSubtotal(precioObjeto + sumaServicios);
  }, [reserva, objeto, detalleReservas]);

  const calcularImpuesto = () => subtotal * 0.12;
  const calcularTotal = () => subtotal + calcularImpuesto() - descuento;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    if (!reserva) {
      setMensaje("No se ha cargado la reserva");
      return;
    }

    const factura = {
      reserva_id: reserva.id,
      cliente_id: clienteId,
      usuario_id: usuarioId,
      fecha: new Date().toISOString().split("T")[0],
      subtotal,
      impuesto: calcularImpuesto(),
      descuento,
      total: calcularTotal(),
      estado_pago: estadoPago.toLowerCase(),
    };

    try {
      const token = localStorage.getItem("token");

      // Crear factura
      const responseFactura = await fetch(`${API_BASE_URL}/facturas`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(factura),
      });

      const dataFactura = await responseFactura.json();
      console.log("Respuesta creación factura:", dataFactura);

      if (!responseFactura.ok) {
        setMensaje(dataFactura.message || "Error al registrar factura");
        return;
      }

      // Actualizar estado de la reserva a "confirmado"
      const responseReserva = await fetch(`${API_BASE_URL}/reservas/${reserva.id}`, {
        method: "PATCH", // o "PUT" si tu API lo requiere
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ estado: "confirmado" }),
      });

      if (!responseReserva.ok) {
        setMensaje("Factura registrada, pero error al actualizar estado de la reserva");
        return;
      }

      // Actualizar estado local y mensaje éxito
      setReserva((prev) => ({ ...prev, estado: "confirmado" }));
      setMensaje("Factura registrada y reserva confirmada correctamente.");

    } catch (error) {
      setMensaje("Error de red o servidor");
    }
  };

  if (!reserva || !objeto) {
    return <p>Cargando datos de la reserva...</p>;
  }

  return (
    <div className="hotel-panel" style={{ maxWidth: 700, margin: "auto" }}>
      <div className="panel-content">
        <h2>Generar Factura para reserva #{id}</h2>

        <p><b>Cliente:</b> {cliente?.nombre || "N/A"}</p>
        <p><b>Tipo de reserva:</b> {reserva.tipo_reserva}</p>
        <p><b>Estado reserva:</b> {reserva.estado}</p>

        <p>
          <b>Detalle:</b>{" "}
          {reserva.tipo_reserva === "habitacion"
            ? `Habitación #${objeto.numero} - Precio por noche: $${precioPorNoche.toFixed(2)}`
            : reserva.tipo_reserva === "salon"
            ? `Salón ${objeto.nombre} - Precio alquiler: $${(parseFloat(objeto.precio_alquiler) || 0).toFixed(2)}`
            : "N/A"}
        </p>

        {/* Servicios extra agregados ocultos para no mostrar */}

        <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
          <div style={{ marginBottom: 10 }}>
            <label>Subtotal:</label>
            <input type="number" value={subtotal} readOnly style={{ width: "100%" }} />
          </div>

          <div style={{ marginBottom: 10 }}>
            <label>Descuento:</label>
            <input
              type="number"
              value={descuento}
              onChange={(e) => setDescuento(parseFloat(e.target.value) || 0)}
              min="0"
              max={subtotal}
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ marginBottom: 10 }}>
            <label>Impuesto (12%):</label>
            <input type="number" value={calcularImpuesto().toFixed(2)} readOnly style={{ width: "100%" }} />
          </div>

          <div style={{ marginBottom: 10 }}>
            <label>Total:</label>
            <input type="number" value={calcularTotal().toFixed(2)} readOnly style={{ width: "100%" }} />
          </div>

          <div style={{ marginBottom: 10 }}>
            <label>Estado de pago:</label>
            <select
              value={estadoPago}
              onChange={(e) => setEstadoPago(e.target.value)}
              style={{ width: "100%" }}
            >
              <option value="Pendiente">Pendiente</option>
              <option value="Pagado">Pagado</option>
              <option value="Cancelado">Cancelado</option>
            </select>
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
            Confirmar Factura
          </button>
        </form>

        {mensaje && (
          <p style={{ marginTop: 20, color: mensaje.startsWith("Error") ? "red" : "green" }}>
            {mensaje}
          </p>
        )}
      </div>
    </div>
  );
}
