import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

const Configuracoes = () => {
  const navigate = useNavigate();
  const [passwordAntiga, setPasswordAntiga] = useState("");
  const [novaPassword, setNovaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [mensagem, setMensagem] = useState({ texto: "", erro: false });

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setMensagem({ texto: "", erro: false });

    if (novaPassword !== confirmarPassword) {
      return setMensagem({ texto: "As novas passwords não coincidem", erro: true });
    }

    const token = localStorage.getItem("token");
    const API_URL = import.meta.env.VITE_API_URL;

    try {
      const res = await fetch(`${API_URL}/users/update-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ passwordAntiga, novaPassword })
      });

      const data = await res.json();

      if (res.ok) {
        setMensagem({ texto: "Password atualizada com sucesso!", erro: false });
        setPasswordAntiga(""); setNovaPassword(""); setConfirmarPassword("");
      } else {
        // Mostra a mensagem específica do backend (ex: "Password antiga incorreta")
        setMensagem({ texto: data.message || "Erro ao atualizar", erro: true });
      }
    } catch (err) {
      setMensagem({ texto: "Erro na ligação ao servidor", erro: true });
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <button onClick={() => navigate("/dashboard")} className="btn-cancel">← Voltar</button>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <h2 className="main-title" style={{ marginTop: '20px', marginBottom: '30px' }}>Configurações de Segurança</h2>

          <div className="modal-box" style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}>
            <h3 style={{ marginBottom: '20px', color: '#2b4d8f', textAlign: "center", fontSize: "22px" }}>Alterar Password</h3>
            <form onSubmit={handleUpdatePassword}>
              <input 
                type="password" placeholder="Password Atual" className="modal-input"
                value={passwordAntiga} onChange={(e) => setPasswordAntiga(e.target.value)} required 
              />
              <input 
                type="password" placeholder="Nova Password (mín. 8 caracteres)" className="modal-input"
                value={novaPassword} onChange={(e) => setNovaPassword(e.target.value)} required 
              />
              <input 
                type="password" placeholder="Confirmar Nova Password" className="modal-input"
                value={confirmarPassword} onChange={(e) => setConfirmarPassword(e.target.value)} required 
              />
              
              {mensagem.texto && (
                <p style={{ color: mensagem.erro ? "#e74c3c" : "#2ecc71", fontSize: "14px", marginBottom: "15px", textAlign: "center", fontWeight: "bold" }}>
                  {mensagem.texto}
                </p>
              )}

              <button type="submit" className="btn-save" style={{ width: "45%", padding: "9px",  margin: "0 auto", display: "block" }}>
                Atualizar Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;