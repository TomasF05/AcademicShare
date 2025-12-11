import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/auth.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Erro ao criar conta");
        return;
      }

      alert("Conta criada com sucesso!");
      window.location.href = "/";
    } catch (err) {
      setError("Erro ao ligar ao servidor");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <h1 className="auth-logo">AcademicShare</h1>
      </div>

      <div className="auth-right">
        <div className="auth-box">
          <h2 className="auth-title">Criar conta</h2>

          <form onSubmit={handleSubmit}>
            <input
              className="auth-input"
              type="email"
              placeholder="Email institucional"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              className="auth-input"
              type="text"
              placeholder="Username"
              value={name}
              onChange={(e) => setName(e.target.value)}
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

            {error && <p style={{ color: "red" }}>{error}</p>}

            <button className="auth-button" type="submit">Criar</button>
          </form>

          <div className="auth-footer">
            <Link to="/" className="auth-link">← Voltar</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
