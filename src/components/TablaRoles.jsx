import React from "react";
export default function TablaRoles() {
  const roles = [
    { id: 1, nombre: "Administrador" },
    { id: 2, nombre: "Recepcionista" },
    { id: 3, nombre: "Gerente" },
  ];
  return (
    <section className="dashboard-section">
      <h2>Roles</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
          </tr>
        </thead>
        <tbody>
          {roles.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.nombre}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}