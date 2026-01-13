const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  addAula,
  getAulasByDisciplina,
  getAulaById,
  updateAula,
  toggleArchiveAula,
} = require("../controllers/aulaController");

const Message = require("../models/Message");

// /api/disciplinas/:disciplinaId/aulas
router.post("/disciplinas/:disciplinaId/aulas", protect, addAula);
router.get("/disciplinas/:disciplinaId/aulas", protect, getAulasByDisciplina);

// /api/aulas/:id
router.get("/aulas/:id", protect, getAulaById);
router.put("/aulas/:id", protect, updateAula);
router.patch("/aulas/:id/archive", protect, toggleArchiveAula);


router.get("/aulas/:id/messages", protect, async (req, res) => {
  try {
    // Procura mensagens daquela aula e ordena das mais antigas para as mais recentes
    const messages = await Message.find({ aula: req.params.id }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Erro ao carregar histórico do chat" });
  }
});

module.exports = router;
