const Disciplina = require('../models/Disciplina');

const addDisciplina = async (req, res) => {
    const { nome, descricao } = req.body;

    if (!nome || !descricao) {
        return res.status(400).json({ message: 'Por favor, preencha todos os campos' });
    }

    try {
        const disciplina = await Disciplina.create({
            nome,
            descricao,
            user: req.user.id // Pegamos o ID do token validado pelo middleware
        });

        res.status(201).json(disciplina);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar disciplina' });
    }
};

// Função extra para listar apenas as disciplinas do utilizador logado
const getDisciplinas = async (req, res) => {
    try {
        let filter = {};

        // Utilizadores normais não veem arquivadas
        if (req.user.role !== "admin") {
          filter.isArchived = false;
        }

        // Find vazio {} significa "procurar tudo sem filtros"
        // .populate('user', 'name') serve para trazer também o nome de quem criou!
        const disciplinas = await Disciplina.find({}).populate('user', 'name');
        
        res.status(200).json(disciplinas);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao procurar disciplinas' });
    }
};

const updateDisciplina = async (req, res) => {
    try {
        const disciplina = await Disciplina.findById(req.params.id);

        if (!disciplina) {
            return res.status(404).json({ message: 'Disciplina não encontrada' });
        }

        if (disciplina.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Não tens permissão para editar esta disciplina' });
        }

        const disciplinaAtualizada = await Disciplina.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );

        res.status(200).json(disciplinaAtualizada);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar disciplina' });
    }
};


const toggleArchiveDisciplina = async (req, res) => {
  try {
    const disciplina = await Disciplina.findById(req.params.id);

    if (!disciplina) {
      return res.status(404).json({ message: "Disciplina não encontrada" });
    }

    if (
      disciplina.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({ message: "Sem permissão" });
    }

    disciplina.isArchived = !disciplina.isArchived;
    await disciplina.save();

    res.status(200).json(disciplina);
  } catch {
    res.status(500).json({ message: "Erro ao arquivar disciplina" });
  }
};

/*const deleteDisciplina = async (req, res) => {
    try {
        const disciplina = await Disciplina.findById(req.params.id);

        if (!disciplina) {
            return res.status(404).json({ message: 'Disciplina não encontrada' });
        }

        // Só quem criou a disciplina ou um admin podem eliminar
        if (disciplina.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Não tens permissão para eliminar esta disciplina' });
        }

        await Disciplina.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Disciplina eliminada com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao eliminar disciplina' });
    }
};*/

module.exports = { 
    addDisciplina, 
    getDisciplinas, 
    updateDisciplina, 
    //deleteDisciplina, 
    toggleArchiveDisciplina,
};