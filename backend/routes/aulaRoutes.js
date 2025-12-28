const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  addAula,
  getAulasByDisciplina,
  getAulaById
} = require("../controllers/aulaController");

// /api/disciplinas/:disciplinaId/aulas
router.post("/disciplinas/:disciplinaId/aulas", protect, addAula);
router.get("/disciplinas/:disciplinaId/aulas", protect, getAulasByDisciplina);

// /api/aulas/:id
router.get("/aulas/:id", protect, getAulaById);

module.exports = router;
