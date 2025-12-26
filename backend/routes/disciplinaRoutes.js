const express = require('express');
const router = express.Router();
const { addDisciplina, getDisciplinas, updateDisciplina, deleteDisciplina } = require('../controllers/disciplinaController');
const { protect } = require('../middleware/authMiddleware');

// Ambas as rotas protegidas por token
router.post('/', protect, addDisciplina);
router.get('/', protect, getDisciplinas);
router.put('/:id', protect, updateDisciplina);
router.delete('/:id', protect, deleteDisciplina);

module.exports = router;