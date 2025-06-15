import './Login.css';

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "/api/login"; // Cambia por la URL completa si es necesario

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-Requested-With": "XMLHttpRequest"
        },
        credentials: "include", // Necesario para cookies/sesiones con Laravel Sanctum
        body: JSON.stringify({
          email,
          password
        })
      });

      if (!response.ok) {
        let data;
        try {
          data = await response.json();
        } catch {
          data = { message: "Error de servidor" };
        }
        setError(data.message || "Error de autenticación");
        return;
      }

      // Si login OK, redirige
      navigate("/dashboard");
    } catch (err) {
      setError("Error de red o servidor (¿está corriendo el backend?)");
    }
  };

  return (
    <div className="login-bg">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Iniciar sesión</h2>
        {error && <div className="login-error">{error}</div>}
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="ejemplo@correo.com"
            required
          />
        </div>
        <div className="form-group">
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default Login;