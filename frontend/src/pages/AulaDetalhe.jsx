import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import Header from "../components/Header";
import ChatAula from "./ChatAula";

const AulaDetalhe = () => {
  const { id } = useParams(); // aulaId
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  // Aula
  const [aula, setAula] = useState(null);
  const [tab, setTab] = useState("materiais");

  // Materiais
  const [materiais, setMateriais] = useState([]);

  // Modal adicionar material
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [materialTipo, setMaterialTipo] = useState("file");
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [link, setLink] = useState("");
  const [file, setFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch aula + materiais
  const fetchMateriais = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/aulas/${id}/materiais`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (res.ok) setMateriais(data);
  };

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
    fetchMateriais();
  }, [id]);

  if (!aula) return null;

  // Submeter material
  const handleSubmitMaterial = async (e) => {
    e.preventDefault();

    if (materialTipo === "file" && !file) {
      alert("Seleciona um ficheiro");
      return;
    }

    setIsSaving(true);

    const token = localStorage.getItem("token");
    const formData = new FormData();

    formData.append("titulo", titulo);
    formData.append("descricao", descricao);
    formData.append("tipo", materialTipo);

    if (materialTipo === "file") {
      formData.append("file", file);
    } else {
      formData.append("link", link);
    }

    try {
      const res = await fetch(`${API_URL}/aulas/${id}/materiais`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        setShowMaterialModal(false);
        setTitulo("");
        setDescricao("");
        setLink("");
        setFile(null);
        setMaterialTipo("file");

        await fetchMateriais(); // atualiza lista

      } else {
        alert("Erro ao submeter material");
      }
    } catch {
      alert("Erro na ligação ao servidor");
    } finally {
      setIsSaving(false);
    }
  };

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
            <button
              className="btn-add"
              onClick={() => setShowMaterialModal(true)}
            >
              + Adicionar material
            </button>
          )}
        </div>

        {/* CONTEÚDO */}
        {tab === "materiais" && (
          materiais.length === 0 ? (
            <div className="empty-state">
              <p>Ainda não há materiais para esta aula.</p>
            </div>
          ) : (
            <div className="disciplinas-grid">
              {materiais.map((material) => (
                <div key={material._id} className="material-card">
                  <h3>{material.titulo}</h3>
                  {material.descricao && <p>{material.descricao}</p>}

                  <div className="card-footer">
                    <span>
                      Submetido por{" "}
                      <strong>{material.user?.name || "Utilizador"}</strong>
                    </span>

                    <span>
                      {new Date(material.createdAt).toLocaleDateString("pt-PT")}
                    </span>

                    {material.tipo === "file" ? (
                      <a
                      href={`${import.meta.env.VITE_BACKEND_URL.replace(/\/$/, '')}${material.url}`}                        target="_blank"
                        rel="noreferrer"
                      >
                        📄 Abrir ficheiro
                      </a>
                    ) : (
                      <a
                        href={material.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        🔗 Abrir link
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}

          {tab === "chat" && (
            <ChatAula aulaId={id} />
          )}
      </main>

      {/* MODAL */}
      {showMaterialModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Submeter material</h3>

            <form onSubmit={handleSubmitMaterial}>
              <input
                type="text"
                className="modal-input"
                placeholder="Título do material"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />

              <textarea
                className="modal-input textarea"
                placeholder="Descrição (opcional)"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              ></textarea>

              <div className="card-actions">
                <button
                  type="button"
                  className={`btn-icon ${materialTipo === "file" ? "edit" : ""}`}
                  onClick={() => setMaterialTipo("file")}
                >
                  📁 Ficheiro
                </button>
                <button
                  type="button"
                  className={`btn-icon ${materialTipo === "link" ? "edit" : ""}`}
                  onClick={() => setMaterialTipo("link")}
                >
                  🔗 Link
                </button>
              </div>

              {materialTipo === "file" && (
                <input
                  type="file"
                  className="modal-input"
                  onChange={(e) => setFile(e.target.files[0])}
                  required
                />
              )}

              {materialTipo === "link" && (
                <input
                  type="url"
                  className="modal-input"
                  placeholder="https://exemplo.com/documento"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  required
                />
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setShowMaterialModal(false);
                    setMaterialTipo("file");
                  }}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn-save"
                  disabled={isSaving}
                >
                  {isSaving ? "A publicar..." : "Publicar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AulaDetalhe;
