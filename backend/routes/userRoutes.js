const express = require('express');
const router = express.Router();

// Importar as duas funções do Controller
const { registerUser, loginUser, getMe, updatePassword } = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');

// Rota para Registar (http://localhost:5000/api/users/register)
router.post('/register', registerUser);

// Rota para Login (http://localhost:5000/api/users/login)
router.post('/login', loginUser);

// Nova rota: apenas utilizadores com token válido podem aceder
router.get('/me', protect, getMe);

router.put('/update-password', protect, updatePassword);

module.exports = router; 