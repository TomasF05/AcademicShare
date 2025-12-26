const express = require('express');
const router = express.Router();
const { addDisciplina, getDisciplinas } = require('../controllers/disciplinaController');
const { protect } = require('../middleware/authMiddleware');

// Ambas as rotas protegidas por token
router.post('/', protect, addDisciplina);
router.get('/', protect, getDisciplinas);

module.exports = router;