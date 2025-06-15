import React from "react";
export default function TablaEmpleados() {
  const empleados = [
    { id: 1, nombre: "Juan Pérez", rol: "Administrador" },
    { id: 2, nombre: "Ana Torres", rol: "Recepcionista" },
    { id: 3, nombre: "Carlos Núñez", rol: "Gerente" },
  ];
  return (
    <section className="dashboard-section">
      <h2>Empleados</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {empleados.map(e => (
            <tr key={e.id}>
              <td>{e.id}</td>
              <td>{e.nombre}</td>
              <td>{e.rol}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}