import { useEffect, useState } from "react";
import "../styles/dashboard.css";
import logo from "../assets/logo.png";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  
  // ESTADOS DE CONTROLO
  const [showModal, setShowModal] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // NOVO ESTADO: Para guardar a lista que vem do MongoDB
  const [disciplinas, setDisciplinas] = useState([]);

  // ESTADOS DO FORMULÁRIO
  const [nomeDisciplina, setNomeDisciplina] = useState("");
  const [descricao, setDescricao] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

// 1. FUNÇÃO PARA CARREGAR AS DISCIPLINAS DO BACKEND
  const fetchDisciplinas = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/disciplinas`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setDisciplinas(data);
    } catch (err) {
      console.error("Erro ao carregar:", err);
    }
  };

  // 2. EXECUTAR AO ENTRAR NA PÁGINA
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
    
    fetchDisciplinas(); // Procura as disciplinas logo ao abrir
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/"; // Manda o utilizador de volta para o Login
  };

  // 3. ENVIAR NOVA DISCIPLINA PARA O MONGODB
  const handleSubmitDisciplina = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    setIsSaving(true);

    try {
      const res = await fetch(`${API_URL}/disciplinas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ nome: nomeDisciplina, descricao: descricao }),
      });

      if (res.ok) {
        setShowModal(false);
        setNomeDisciplina("");
        setDescricao("");
        fetchDisciplinas(); // Atualiza a lista automaticamente após guardar!
      }
    } catch (err) {
      alert("Erro ao ligar ao servidor");

    }finally {
    setIsSaving(false); 
  }
};

  return (
    <div className="dashboard-container">
      {/* HEADER / NAVBAR */}
      <header className="dashboard-header">
        <div className="header-left">
          <img src={logo} alt="Logo" className="header-logo-img" />
          <h1 className="header-title">AcademicShare</h1>
        </div>
        
        <nav className="header-nav">
          <div className="nav-item">
            <span className="nav-icon">📚</span> Disciplinas
          </div>
          <button className="btn-submit">Submeter</button>
          
          {/* PERFIL (SEM O BOTÃO SAIR DENTRO) */}
          <div className="user-profile-container">
            <div className="user-profile" onClick={() => setIsProfileOpen(!isProfileOpen)}>
              <span className="profile-icon">👤</span>
            </div>

            {isProfileOpen && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <strong>{user?.name || "Utilizador"}</strong>
                </div>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item">O meu perfil</button>
                <button className="dropdown-item">Configurações</button>
              </div>
            )}
          </div>

          {/* BOTÃO SAIR (VOLTOU PARA O LUGAR ORIGINAL) */}
          <button className="btn-logout" onClick={handleLogout}>
            <span className="logout-icon">⊙</span> Sair
          </button>
        </nav>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="dashboard-content">
        <div className="content-header">
          <h2 className="main-title">Minhas Disciplinas</h2>
          <button className="btn-add" onClick={() => setShowModal(true)}>
            + Nova Disciplina
          </button>
        </div>

       <div className="disciplinas-grid">
          {disciplinas.length > 0 ? (
            disciplinas.map((disc) => (
              <div key={disc._id} className="disciplina-card">
                <div className="card-content">
                  <h3>{disc.nome}</h3>
                  <p>{disc.descricao}</p>
                </div>
                <div className="card-footer">
                  Criada por: <strong>{disc.user?.name || "Colega"}</strong>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>Ainda não há disciplinas adicionadas.</p>
              <p>Clica em "+ Nova Disciplina" para começar.</p>
            </div>
          )}
        </div>
      </main>

      {/* MODAL DE NOVA DISCIPLINA */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Adicionar Nova Disciplina</h3>
            <form onSubmit={handleSubmitDisciplina}>
              <input 
                type="text" 
                placeholder="Nome da Disciplina" 
                className="modal-input"
                value={nomeDisciplina}
                onChange={(e) => setNomeDisciplina(e.target.value)}
                required
              />
              <textarea 
                placeholder="Breve descrição..." 
                className="modal-input textarea"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
              ></textarea>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-save" 
                  disabled={isSaving} // Bloqueia o botão se estiver a gravar
                  style={{ opacity: isSaving ? 0.5 : 1, cursor: isSaving ? 'not-allowed' : 'pointer' }}
                >
                  {isSaving ? "A guardar..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;