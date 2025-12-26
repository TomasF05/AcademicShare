const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // Verifica se o token vem no header "Authorization" como "Bearer <token>"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]; // Extrai o token
            const decoded = jwt.verify(token, process.env.JWT_SECRET); // Descodifica o ID
            
            // Busca o utilizador no MongoDB e anexa-o à requisição (req.user)
            req.user = await User.findById(decoded.id).select('-password');
            
            next(); // Permite avançar para o Controller
        } catch (error) {
            res.status(401).json({ message: 'Não autorizado, token inválido' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Não autorizado, sem token' });
    }
};

module.exports = { protect };