import React from "react";
export default function TablaSalones() {
  const salones = [
    { id: 1, nombre: "Salón Azul", capacidad: 50 },
    { id: 2, nombre: "Salón Oro", capacidad: 80 },
  ];
  return (
    <section className="dashboard-section">
      <h2>Salones</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Capacidad</th>
          </tr>
        </thead>
        <tbody>
          {salones.map(s => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.nombre}</td>
              <td>{s.capacidad}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}