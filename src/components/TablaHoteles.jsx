import React from "react";
export default function TablaHoteles() {
  const hoteles = [
    { id: 1, nombre: "Hotel Central", ciudad: "Quito" },
    { id: 2, nombre: "Hotel del Lago", ciudad: "Guayaquil" },
  ];
  return (
    <section className="dashboard-section">
      <h2>Hoteles</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Ciudad</th>
          </tr>
        </thead>
        <tbody>
          {hoteles.map(h => (
            <tr key={h.id}>
              <td>{h.id}</td>
              <td>{h.nombre}</td>
              <td>{h.ciudad}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}