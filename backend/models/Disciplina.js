const mongoose = require('mongoose');

const disciplinaSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' 
    },
    nome: {
        type: String,
        required: [true, 'Por favor, adicione o nome da disciplina']
    },
    descricao: {
        type: String,
        required: [true, 'Por favor, adicione uma breve descrição']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Disciplina', disciplinaSchema);