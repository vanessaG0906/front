import React from "react";
export default function TablaHabitaciones() {
  const habitaciones = [
    { id: 1, numero: "101", tipo: "Suite", estado: "Disponible" },
    { id: 2, numero: "102", tipo: "Doble", estado: "Ocupada" },
  ];
  return (
    <section className="dashboard-section">
      <h2>Habitaciones</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Número</th>
            <th>Tipo</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {habitaciones.map(h => (
            <tr key={h.id}>
              <td>{h.id}</td>
              <td>{h.numero}</td>
              <td>{h.tipo}</td>
              <td>{h.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}