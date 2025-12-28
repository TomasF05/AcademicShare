import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/dashboard.css"; // reaproveita o mesmo CSS
import logo from "../assets/logo.png";
import Header from "../components/Header";


const DisciplinaDetalhe = () => {
  const { id } = useParams(); // disciplinaId
  const navigate = useNavigate();

  const [disciplina, setDisciplina] = useState(null);
  const [aulas, setAulas] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  // MODAL
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // FORM
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");


  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchDisciplina = async () => {
      const res = await fetch(`${API_URL}/disciplinas`, {
        headers: { Authorization: `Bearer ${token}` },
      }, [id, API_URL]); // dependência
      const data = await res.json();
      const disc = data.find(d => d._id === id);
      setDisciplina(disc);
    };

    const fetchAulas = async () => {
      const res = await fetch(`${API_URL}/disciplinas/${id}/aulas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setAulas(data);
    };

    fetchDisciplina();
    fetchAulas();
  }, [id]);

  const handleCreateAula = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setIsSaving(true);

    try {
      const res = await fetch(
        `${API_URL}/disciplinas/${id}/aulas`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            titulo,
            descricao,
            data,
          }),
        }
      );

      if (res.ok) {
        const novaAula = await res.json();

        setAulas((prev) => [novaAula, ...prev]);

        setShowModal(false);
        setTitulo("");
        setDescricao("");
        setData("");
      }

    } catch (err) {
      alert("Erro ao criar aula");
    } finally {
      setIsSaving(false);
    }
  };


  return (
    <div className="dashboard-container">
      {/* HEADER */}
      <Header />

      <main className="dashboard-content">
        <div className="back-link" onClick={() => navigate("/dashboard")}>
            ← Voltar para Disciplinas
        </div>


        <div className="content-header">
          <h2 className="main-title">{disciplina?.nome}</h2>
          <button className="btn-add" onClick={() => setShowModal(true)}>
            + Nova Aula
          </button>

        </div>

        <div className="disciplinas-grid">
          {aulas.length > 0 ? (
            aulas.map((aula) => (
              <div
                key={aula._id}
                className="disciplina-card"
                onClick={() => navigate(`/aulas/${aula._id}`)}
                style={{ cursor: "pointer" }}
              >
                <div>
                  <h3>{aula.titulo}</h3>
                  <p>{aula.descricao}</p>
                </div>
                <div className="card-footer">
                  <span>
                    {new Date(aula.data).toLocaleDateString("pt-PT")}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>Ainda não há aulas nesta disciplina.</p>
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Criar Nova Aula</h3>

            <form onSubmit={handleCreateAula}>
              <input
                type="text"
                placeholder="Ex: Introdução a Arrays"
                className="modal-input"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />

              <input
                type="date"
                className="modal-input"
                value={data}
                onChange={(e) => setData(e.target.value)}
                required
              />

              <textarea
                placeholder="Breve descrição da aula"
                className="modal-input textarea"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
              ></textarea>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn-save"
                  disabled={isSaving}
                  style={{
                    opacity: isSaving ? 0.5 : 1,
                    cursor: isSaving ? "not-allowed" : "pointer",
                  }}
                >
                  {isSaving ? "A criar..." : "Criar Aula"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default DisciplinaDetalhe;
