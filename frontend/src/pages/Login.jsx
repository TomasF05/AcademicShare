import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

      localStorage.setItem("token", data.token);
      window.location.href = "/dashboard";

    } catch (err) {
      setError("Erro ao ligar ao servidor");
    }
  };

  return (
    <div className="auth-container">
      {/* LADO ESQUERDO */}
      <div className="auth-left">
        {/* Falta colocar o logo - colocamos foto? */}
        <h1 className="auth-logo">AcademicShare</h1>
      </div>

      {/* LADO DIREITO */}
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

            <input
              className="auth-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}

            <button className="auth-button" type="submit">Entrar</button>
          </form>

          <div className="auth-footer">
            Ainda não tem conta?{" "}
            <Link to="/register" className="auth-link">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
