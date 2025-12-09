const express = require('express');
const router = express.Router();

// Importar as duas funções do Controller
const { registerUser, loginUser } = require('../controllers/userController');

// Rota para Registar (http://localhost:5000/api/users/register)
router.post('/register', registerUser);

// Rota para Login (http://localhost:5000/api/users/login)
router.post('/login', loginUser);

module.exports = router;