const Aula = require("../models/Aula");

// Criar aula
const addAula = async (req, res) => {
  const { titulo, descricao, data } = req.body;

  if (!titulo || !descricao || !data) {
    return res.status(400).json({ message: "Preenche todos os campos" });
  }

  try {
    const aula = await Aula.create({
      titulo,
      descricao,
      data,
      disciplina: req.params.disciplinaId,
      user: req.user.id,
    });

    res.status(201).json(aula);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar aula" });
  }
};

// Listar aulas por disciplina
const getAulasByDisciplina = async (req, res) => {
  try {
    const aulas = await Aula.find({ disciplina: req.params.disciplinaId })
      .sort({ data: -1 });

    res.status(200).json(aulas);
  } catch (error) {
    res.status(500).json({ message: "Erro ao procurar aulas" });
  }
};

// Obter aula por id
const getAulaById = async (req, res) => {
  try {
    const aula = await Aula.findById(req.params.id);

    if (!aula) {
      return res.status(404).json({ message: "Aula não encontrada" });
    }

    res.status(200).json(aula);
  } catch (error) {
    res.status(500).json({ message: "Erro ao procurar aula" });
  }
};

// Editar aula (só quem criou ou admin)
const updateAula = async (req, res) => {
  try {
    const aula = await Aula.findById(req.params.id);

    if (!aula) {
      return res.status(404).json({ message: "Aula não encontrada" });
    }

    // Permissões
    if (aula.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res
        .status(401)
        .json({ message: "Não tens permissão para editar esta aula" });
    }

    const aulaAtualizada = await Aula.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(aulaAtualizada);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar aula" });
  }
};

module.exports = {
  addAula,
  getAulasByDisciplina,
  getAulaById,
  updateAula,
};
