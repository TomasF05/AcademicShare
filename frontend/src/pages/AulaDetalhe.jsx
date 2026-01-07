import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import Header from "../components/Header";
import ChatAula from "./ChatAula";
import { Pencil } from "lucide-react";

const AulaDetalhe = () => {
  const { id } = useParams(); // aulaId
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const user = JSON.parse(localStorage.getItem("user"));

  // Aula
  const [aula, setAula] = useState(null);
  const [tab, setTab] = useState("materiais");

  // Materiais
  const [materiais, setMateriais] = useState([]);

  // Modal
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Form
  const [materialTipo, setMaterialTipo] = useState("file");
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [link, setLink] = useState("");
  const [file, setFile] = useState(null);

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
  }, [id, API_URL]);

  if (!aula) return null;

  // Modal controls
  const handleOpenCreateMaterial = () => {
    setIsEditing(false);
    setEditId(null);
    setTitulo("");
    setDescricao("");
    setLink("");
    setFile(null);
    setMaterialTipo("file");
    setShowMaterialModal(true);
  };

  const handleOpenEditMaterial = (material) => {
    setIsEditing(true);
    setEditId(material._id);
    setTitulo(material.titulo);
    setDescricao(material.descricao || "");
    setMaterialTipo(material.tipo);

    if (material.tipo === "link") {
      setLink(material.url);
    }

    setShowMaterialModal(true);
  };

  // Criar material
  const handleCreateMaterial = async (e) => {
    e.preventDefault();
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
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        setShowMaterialModal(false);
        fetchMateriais();
      } else {
        alert("Erro ao criar material");
      }
    } catch {
      alert("Erro na ligação ao servidor");
    } finally {
      setIsSaving(false);
    }
  };

  // Editar material
  const handleUpdateMaterial = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const token = localStorage.getItem("token");
    const formData = new FormData();

    formData.append("titulo", titulo);
    formData.append("descricao", descricao);
    formData.append("tipo", materialTipo);

    if (materialTipo === "file" && file) {
      formData.append("file", file);
    }

    if (materialTipo === "link") {
      formData.append("link", link);
    }

    try {
      const res = await fetch(`${API_URL}/materiais/${editId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        setShowMaterialModal(false);
        setIsEditing(false);
        setEditId(null);
        fetchMateriais();
      } else {
        alert("Erro ao editar material");
      }
    } catch {
      alert("Erro na ligação ao servidor");
    } finally {
      setIsSaving(false);
    }
  };

  // Download
  const handleDownload = async (fileUrl, fileName) => {
    const response = await fetch(fileUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();

    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="dashboard-container">
      <Header />

      <main className="dashboard-content">
        <div className="back-link" onClick={() => navigate(-1)}>
          ← Voltar para Disciplina
        </div>

        <div className="content-header">
          <h2 className="main-title">{aula.titulo}</h2>

          {tab === "materiais" && (
            <button className="btn-add" onClick={handleOpenCreateMaterial}>
              + Adicionar material
            </button>
          )}
        </div>

        <p style={{ marginBottom: "30px" }}>
          {new Date(aula.data).toLocaleDateString("pt-PT")} · {aula.descricao}
        </p>

        {/* TABS */}
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

        {/* MATERIAIS */}
        {tab === "materiais" &&
          (materiais.length === 0 ? (
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
                      <strong>{material.user?.name}</strong>
                    </span>

                    {(material.user?._id === user?.id ||
                      user?.role === "admin") && (
                      <button
                        className="btn-icon edit"
                        onClick={() => handleOpenEditMaterial(material)}
                      >
                        <Pencil size={18} />
                      </button>
                    )}
                  </div>

                  {material.tipo === "file" ? (
                    <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
                      <a
                        href={`${BACKEND_URL.replace(/\/$/, "")}${material.url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-link"
                      >
                        📄 Abrir
                      </a>

                      <button
                        onClick={() =>
                          handleDownload(
                            `${BACKEND_URL.replace(/\/$/, "")}${material.url}`,
                            material.titulo
                          )
                        }
                        className="btn-link"
                        style={{
                          background: "none",
                          border: "none",
                          padding: 0,
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        📥 Download
                      </button>
                    </div>
                  ) : (
                    <a
                      href={
                        material.url.startsWith("http")
                          ? material.url
                          : `https://${material.url}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="btn-link"
                    >
                      🔗 Abrir link
                    </a>
                  )}
                </div>
              ))}
            </div>
          ))}

        {tab === "chat" && <ChatAula aulaId={id} />}
      </main>

      {/* MODAL */}
      {showMaterialModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>{isEditing ? "Editar Material" : "Adicionar Material"}</h3>

            <form
              onSubmit={isEditing ? handleUpdateMaterial : handleCreateMaterial}
            >
              <input
                type="text"
                className="modal-input"
                placeholder="Título"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />

              <textarea
                className="modal-input textarea"
                placeholder="Descrição (opcional)"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />

              <div className="card-actions">
                <button
                  type="button"
                  className={`btn-icon ${
                    materialTipo === "file" ? "edit" : ""
                  }`}
                  onClick={() => setMaterialTipo("file")}
                >
                  📁 Ficheiro
                </button>
                <button
                  type="button"
                  className={`btn-icon ${
                    materialTipo === "link" ? "edit" : ""
                  }`}
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
                />
              )}

              {materialTipo === "link" && (
                <input
                  type="url"
                  className="modal-input"
                  placeholder="https://exemplo.com"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  required
                />
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowMaterialModal(false)}
                >
                  Cancelar
                </button>

                <button type="submit" className="btn-save" disabled={isSaving}>
                  {isSaving
                    ? "A guardar..."
                    : isEditing
                    ? "Guardar alterações"
                    : "Publicar"}
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
