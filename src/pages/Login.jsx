import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';

const API_URL = "http://localhost:8000/api/login"; // Cambia por la URL completa si no usas proxy

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
          "Accept": "application/json"
        },
        body: JSON.stringify({ email, password })
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

      // Espera que el backend devuelva { token: "..." }
      const data = await response.json();
      if (data.token) {
        localStorage.setItem("token", data.token); // Guarda el token
        navigate("/dashboard"); // Cambia la ruta si tu dashboard es distinto
      } else {
        setError("No se recibió token del servidor");
      }
    } catch (err) {
      setError("Error de red o servidor");
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