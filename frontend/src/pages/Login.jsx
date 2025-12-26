import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/auth.css";
import logo from "../assets/logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Estado para alternar visibilidade
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Erro ao iniciar sessão");
        return;
      }

      // Guarda o token E os dados do utilizador (nome, etc)
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ name: data.name, id: data.id })); // Adiciona esta linha
      window.location.href = "/dashboard";

    } catch (err) {
      setError("Erro ao ligar ao servidor");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <img src={logo} alt="AcademicShare Logo" className="auth-logo-img" />
        <h1 className="auth-logo">AcademicShare</h1>
      </div>

      <div className="auth-right">
        <div className="auth-box">
          <h2 className="auth-title">Login</h2>

          <form onSubmit={handleSubmit}>
            <input
              className="auth-input"
              type="email"
              placeholder="Username ou email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Contentor para posicionar o ícone dentro do input */}
            <div className="password-container">
              <input
                className="auth-input"
                type={showPassword ? "text" : "password"} // Alterna o tipo
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span 
                className="password-toggle-icon" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {error && <p style={{ color: "red", marginBottom: "10px", textAlign: "center" }}>{error}</p>}

            <div className="auth-footer-stack">
              <p className="auth-text-small">
                Ainda não tem conta? <Link to="/register" className="auth-link-blue">Sign in</Link>
              </p>
              <button className="auth-button-full" type="submit">Entrar</button>
            </div>
          </form>
          
        </div>
      </div>
    </div>
  );
};

export default Login;