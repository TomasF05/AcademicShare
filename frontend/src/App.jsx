import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Perfil from "./pages/Perfil";
import Configuracoes from "./pages/Configuracoes";
import DisciplinaDetalhe from "./pages/DisciplinaDetalhe";
import AulaDetalhe from "./pages/AulaDetalhe";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="/disciplinas/:id" element={<DisciplinaDetalhe />} />
        <Route path="/aulas/:id" element={<AulaDetalhe />} />
      </Routes>
    </Router>
  );
}

export default App;
