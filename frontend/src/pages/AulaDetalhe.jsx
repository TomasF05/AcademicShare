import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import logo from "../assets/logo.png";
import Header from "../components/Header";


const AulaDetalhe = () => {
  const { id } = useParams(); // aulaId
  const navigate = useNavigate();

  const [aula, setAula] = useState(null);
  const [tab, setTab] = useState("materiais");

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchAula = async () => {
      const res = await fetch(`${API_URL}/aulas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setAula(data);
    };

    fetchAula();
  }, [id]);

  if (!aula) return null;

  return (
    <div className="dashboard-container">
      <Header />

      <main className="dashboard-content">
        <div className="back-link" onClick={() => navigate(-1)}>
          ← Voltar para Disciplina
        </div>

        <h2 className="main-title">{aula.titulo}</h2>
        <p>
          {new Date(aula.data).toLocaleDateString("pt-PT")} · {aula.descricao}
        </p>

        {/* TABS */}
        <div className="content-header">
          <div className="card-actions">
            <button
              className={`btn-icon ${tab === "materiais" ? "edit" : ""}`}
              onClick={() => setTab("materiais")}
            >
              Materiais
            </button>
            <button
              className={`btn-icon ${tab === "chat" ? "edit" : ""}`}
              onClick={() => setTab("chat")}
            >
              Chat
            </button>
          </div>

          {tab === "materiais" && (
            <button className="btn-add">+ Adicionar material</button>
          )}
        </div>

        {/* CONTEÚDO */}
        {tab === "materiais" && (
          <div className="empty-state">
            <p>Ainda não há materiais para esta aula.</p>
          </div>
        )}

        {tab === "chat" && (
          <div className="empty-state">
            <p>Chat em tempo real (em breve...)</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AulaDetalhe;
