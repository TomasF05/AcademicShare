const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Por favor, insira um nome']
    },
    email: {
        type: String,
        required: [true, 'Por favor, insira um email'],
        unique: true,
        // Regra para validar se termina em @ipvc.pt
        match: [
            /^[a-zA-Z0-9._%+-]+@ipvc\.pt$/, 
            'Por favor, utilize um email institucional @ipvc.pt'
        ]
    },
    password: {
        type: String,
        required: [true, 'Por favor, insira uma password'],
        minlength: [8, 'A password deve ter pelo menos 8 caracteres'] // Validação no MongoDB
    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student'
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('User', userSchema);