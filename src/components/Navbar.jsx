import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">🏨 Gestion del Hotel</div>
      <div className="navbar-links">
        <Link to="/login">Login</Link>
        {/* Agrega más enlaces si lo necesitas */}
      </div>
    </nav>
  );
}