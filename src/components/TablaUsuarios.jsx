import React from "react";
export default function TablaUsuarios() {
  const usuarios = [
    { id: 1, nombre: "admin", email: "admin@hotel.com" },
    { id: 2, nombre: "user1", email: "user1@hotel.com" },
    { id: 3, nombre: "user2", email: "user2@hotel.com" },
  ];
  return (
    <section className="dashboard-section">
      <h2>Usuarios</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.nombre}</td>
              <td>{u.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}