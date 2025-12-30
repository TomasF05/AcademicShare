import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

const Perfil = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem("token");
      const API_URL = import.meta.env.VITE_API_URL;

      try {
        const res = await fetch(`${API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUserData(data);
        } else {
          navigate("/"); // Se o token for inválido, volta para o login
        }
      } catch (err) {
        console.error("Erro ao carregar perfil:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [navigate]);

  if (loading) return <div className="dashboard-container"><p>A carregar...</p></div>;

  return (
    <div className="dashboard-container">
        <div className="dashboard-content">
        <button onClick={() => navigate("/dashboard")} className="btn-cancel">← Voltar</button>
        
        {/* Container para centralizar o título e a caixa */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <h2 className="main-title" style={{ marginTop: '20px', marginBottom: '30px' }}>O meu Perfil</h2>

            <div className="modal-box" style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}>
            <div style={{ marginBottom: '20px' }}>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Nome:</label>
                <p className="modal-input" style={{ background: '#f9f9f9', marginBottom: '0' }}>{userData?.name}</p>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Email:</label>
                <p className="modal-input" style={{ background: '#f9f9f9', marginBottom: '0' }}>{userData?.email}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Cargo:</label>
                <p className="modal-input" style={{ background: '#f9f9f9', textTransform: 'capitalize', marginBottom: '0' }}>
                {userData?.role === 'student' ? 'Aluno' : 'Administrador'}
                </p>
            </div>
            </div>
        </div>
        </div>
    </div>
    );
};

export default Perfil;