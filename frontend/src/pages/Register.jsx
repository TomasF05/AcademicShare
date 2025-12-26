import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/auth.css";
import logo from "../assets/logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";


const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 1. VALIDAÇÃO: As passwords são iguais?
    if (password !== confirmPassword) {
      setError("As passwords não coincidem.");
      return;
    }

    // 2. VALIDAÇÃO DA PASSWORD (8 caracteres)
    if (password.length < 8) {
      setError("A password deve ter pelo menos 8 caracteres.");
      return;
    }

    // 3. VALIDAÇÃO DO EMAIL INSTITUCIONAL (@ipvc.pt)
    if (!email.endsWith("@ipvc.pt")) {
      setError("Deve utilizar um email institucional (@ipvc.pt).");
      return;
    }

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
        <img src={logo} alt="AcademicShare Logo" className="auth-logo-img" />
        <h1 className="auth-logo">AcademicShare</h1>
      </div>

      <div className="auth-right">
        <div className="auth-box">
          <h2 className="auth-title">Criar conta</h2>

          <form onSubmit={handleSubmit}>
            <input
              className="auth-input"
              type="email"
              placeholder="Email  (ex: aluno@ipvc.pt)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // Validação nativa do browser para terminar em @ipvc.pt
              pattern=".+@ipvc\.pt"
              title="O email deve terminar em @ipvc.pt"
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

            <div className="password-container">
              <input
                className="auth-input"
                type={showPassword ? "text" : "password"}
                placeholder="Password (mín. 8 caracteres)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
              <span 
                className="password-toggle-icon" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="password-container">
              <input
                className="auth-input"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmar Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span 
                className="password-toggle-icon" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {error && <p style={{ color: "red", fontSize: "14px", textAlign: "center", marginBottom: "10px" }}>{error}</p>}

            <div className="auth-actions">
              <Link to="/" className="auth-link">
                <span>←</span> Voltar
              </Link>
              <button className="auth-button" type="submit">
                Criar
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Register;