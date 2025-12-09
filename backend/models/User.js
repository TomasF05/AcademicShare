const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Por favor, insira um nome']
    },
    email: {
        type: String,
        required: [true, 'Por favor, insira um email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Por favor, insira uma password']
    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student'

    }
}, { 
    timestamps: true // adiciona automaticamento campos createdAt e updatedAt. útil para saber quando o user foi criado ou atualizado
});

module.exports = mongoose.model('User', userSchema);