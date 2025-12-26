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
        // Find vazio {} significa "procurar tudo sem filtros"
        // .populate('user', 'name') serve para trazer também o nome de quem criou!
        const disciplinas = await Disciplina.find({}).populate('user', 'name');
        
        res.status(200).json(disciplinas);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao procurar disciplinas' });
    }
};

module.exports = { addDisciplina, getDisciplinas };