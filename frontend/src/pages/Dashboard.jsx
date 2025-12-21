import { useEffect, useState } from "react";
import "../styles/dashboard.css";
import logo from "../assets/logo.png";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  
  // ESTADOS DE CONTROLO
  const [showModal, setShowModal] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // ESTADOS DO FORMULÁRIO
  const [nomeDisciplina, setNomeDisciplina] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    setUser({ name: "Utilizador" }); 
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const handleSubmitDisciplina = (e) => {
    e.preventDefault();
    console.log("Nova Disciplina:", { nomeDisciplina, descricao });
    setShowModal(false);
    setNomeDisciplina("");
    setDescricao("");
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
          <div className="empty-state">
            <p>Ainda não tens disciplinas adicionadas.</p>
            <p>Clica em "+ Nova Disciplina" para começar.</p>
          </div>
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
                <button type="submit" className="btn-save">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;