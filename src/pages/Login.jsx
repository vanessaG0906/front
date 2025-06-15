import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        // Redirige al dashboard o a donde quieras
        window.location.href = '/dashboard';
      } else {
        setError(data.error || 'Credenciales inválidas');
      }
    } catch (e) {
      setError('Error de conexión al servidor');
    }
  };

  return (
    <div style={{maxWidth: 400, margin: 'auto', marginTop: 100}}>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label><br />
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Contraseña:</label><br />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        {error && <div style={{color: 'red'}}>{error}</div>}
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}