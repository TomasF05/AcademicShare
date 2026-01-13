import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/dashboard.css"; // reaproveita o mesmo CSS
import logo from "../assets/logo.png";
import Header from "../components/Header";
import { Pencil, Archive, RotateCcw} from "lucide-react";

const DisciplinaDetalhe = () => {
  const { id } = useParams(); // disciplinaId
  const navigate = useNavigate();

  const [disciplina, setDisciplina] = useState(null);
  const [aulas, setAulas] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;
  const user = JSON.parse(localStorage.getItem("user"));

  // MODAL
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // FORM
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");


  const token = localStorage.getItem("token");

  
  const fetchDisciplina = async () => {
    const res = await fetch(`${API_URL}/disciplinas`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setDisciplina(data.find((d) => d._id === id));
  };

  
  const fetchAulas = async () => {
    const res = await fetch(`${API_URL}/disciplinas/${id}/aulas`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) setAulas(data);
  };

  useEffect(() => {
    fetchDisciplina();
    fetchAulas();
  }, [id]);



  // Modal controls
  // Limpar os campos
  const handleOpenCreate = () => {
    setIsEditing(false);
    setEditId(null);
    setTitulo("");
    setDescricao("");
    setData("");
    setShowModal(true);
  };

  // Preencher os campos
  const handleOpenEdit = (aula) => {
    setIsEditing(true);
    setEditId(aula._id);
    setTitulo(aula.titulo);
    setDescricao(aula.descricao);
    setData(aula.data.split("T")[0]);
    setShowModal(true);
  };


  // Criar aula
  const handleCreateAula = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setIsSaving(true);

    try {
      const res = await fetch(`${API_URL}/disciplinas/${id}/aulas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ titulo, descricao, data }),
      });

      if (res.ok) {
        const novaAula = await res.json();
        setAulas((prev) => [novaAula, ...prev]);
        setShowModal(false);
      } else {
        const err = await res.json();
        alert(err.message || "Erro ao criar aula");
      }
    } catch {
      alert("Erro na ligação ao servidor");
    } finally {
      setIsSaving(false);
    }
  };


  // Editar aula
  const handleUpdateAula = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setIsSaving(true);

    try {
      const res = await fetch(`${API_URL}/aulas/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ titulo, descricao, data }),
      });

      if (res.ok) {
        const aulaAtualizada = await res.json();
        setAulas((prev) =>
          prev.map((a) => (a._id === editId ? aulaAtualizada : a))
        );
        setShowModal(false);
        setIsEditing(false);
      } else {
        const err = await res.json();
        alert(err.message || "Erro ao editar aula");
      }
    } catch {
      alert("Erro na ligação ao servidor");
    } finally {
      setIsSaving(false);
    }
  };

  // Arquivar/ ativar aulas
  const handleToggleArchiveAula = async (aulaId) => {
    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/aulas/${aulaId}/archive`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchAulas();
  };
  
  // Filtro de visibilidade
  const aulasVisiveis = aulas.filter((aula) => {
    if (!aula.isArchived) return true;
    return aula.user === user?.id || user?.role === "admin";
  });

  return (
    <div className="dashboard-container">
      <Header />

      <main className="dashboard-content">
        <div className="back-link" onClick={() => navigate("/dashboard")}>
            ← Voltar para Disciplinas
        </div>


        <div className="content-header">
          <h2 className="main-title">{disciplina?.nome}</h2>
          <button className="btn-add" onClick={handleOpenCreate}>
            + Nova Aula
          </button>
        </div>

        <div className="disciplinas-grid">
          {aulasVisiveis.length > 0 ? (
            aulasVisiveis.map((aula) => (
              <div
                key={aula._id}
                className={`disciplina-card ${aula.isArchived ? "archived" : ""}`}
                onClick={() => !aula.isArchived && navigate(`/aulas/${aula._id}`)}
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

                  {(aula.user === user?.id || user?.role === "admin") && (
                    <div className="card-actions">
                      {!aula.isArchived && (
                        <button
                          className="btn-icon edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEdit(aula);
                          }}
                        >
                          <Pencil size={18} />
                        </button>
                      )}
                      <button
                        className="btn-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleArchiveAula(aula._id);
                        }}
                      >
                        {aula.isArchived ? (
                          <RotateCcw size={18} />
                        ) : (
                          <Archive size={18} />
                        )}
                      </button>
                    </div>
                  )}
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
            <h3>{isEditing ? "Editar Aula" : "Criar Nova Aula"}</h3>

            <form onSubmit={isEditing ? handleUpdateAula : handleCreateAula}>
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
                >
                  {isSaving 
                    ? "A guardar..." 
                    : isEditing 
                    ? "Guardar alterações" 
                    : "Criar Aula"}
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
