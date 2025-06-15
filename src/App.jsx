import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
// importa otros componentes como Dashboard cuando los crees

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* Otras rutas aquí */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;