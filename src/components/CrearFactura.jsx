import { useParams } from "react-router-dom";
import { useState } from "react";


const API_BASE_URL = "http://localhost:8000/api";

export default function CrearFactura() {
  const { id } = useParams(); // este es el ID de la reserva desde la URL
  const [subtotal, setSubtotal] = useState(0);
  const [descuento, setDescuento] = useState(0);
  const [estadoPago, setEstadoPago] = useState("Pendiente");
  const [mensaje, setMensaje] = useState("");

  // Suplanta cliente y usuario con valores fijos o lógica adicional si es necesario
  const clienteId = 1; 
  const usuarioId = 1;

  const calcularImpuesto = () => subtotal * 0.12;
  const calcularTotal = () => subtotal + calcularImpuesto() - descuento;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    const factura = {
      reserva_id: id,
      cliente_id: clienteId,
      usuario_id: usuarioId,
      fecha: new Date().toISOString().split("T")[0],
      subtotal,
      impuesto: calcularImpuesto(),
      descuento,
      total: calcularTotal(),
      estado_pago: estadoPago,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/facturas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(factura),
      });

      if (response.ok) {
        setMensaje("Factura registrada correctamente.");
      } else {
        const data = await response.json();
        setMensaje(data.message || "Error al registrar factura");
      }
    } catch (error) {
      setMensaje("Error de red o servidor");
    }
  };

  return (
    <div className="hotel-panel">
      <div className="panel-content">
        <h2>Generar Factura para reserva #{id}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Subtotal:</label>
            <input
              type="number"
              value={subtotal}
              onChange={(e) => setSubtotal(parseFloat(e.target.value))}
              required
            />
          </div>

          <div>
            <label>Descuento:</label>
            <input
              type="number"
              value={descuento}
              onChange={(e) => setDescuento(parseFloat(e.target.value))}
            />
          </div>

          <div>
            <label>Impuesto (12%):</label>
            <input type="number" value={calcularImpuesto().toFixed(2)} disabled />
          </div>

          <div>
            <label>Total:</label>
            <input type="number" value={calcularTotal().toFixed(2)} disabled />
          </div>

          <div>
            <label>Estado de pago:</label>
            <select
              value={estadoPago}
              onChange={(e) => setEstadoPago(e.target.value)}
            >
              <option value="Pendiente">Pendiente</option>
              <option value="Pagado">Pagado</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>

          <button type="submit">Confirmar Factura</button>
        </form>
        {mensaje && <p>{mensaje}</p>}
      </div>
    </div>
  );
}
