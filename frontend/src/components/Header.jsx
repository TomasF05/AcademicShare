import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const Header = () => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <img src={logo} alt="Logo" className="header-logo-img" />
        <h1 className="header-title">AcademicShare</h1>
      </div>

      <nav className="header-nav">
        <div
          className="nav-item"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/dashboard")}
        >
          📚 Disciplinas
        </div>

        


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
                
                {/* ADICIONADO: Navegação para o perfil */}
                <button className="dropdown-item" onClick={() => {
                  setIsProfileOpen(false);
                  navigate("/perfil");
                }}>
                  O meu perfil
                </button>
                <button className="dropdown-item" onClick={() => {
                      setIsProfileOpen(false);
                      navigate("/configuracoes");
                    }}>
                      Configurações
                </button>              
              </div>
            )}
          </div>

        <button className="btn-logout" onClick={handleLogout}>
          ⊙ Sair
        </button>
      </nav>
    </header>
  );
};

export default Header;
