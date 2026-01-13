const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  addMaterial,
  getMateriaisByAula,
  updateMaterial,
  toggleArchiveMaterial,
} = require("../controllers/materialController");

// /api/aulas/:aulaId/materiais
router.post("/aulas/:aulaId/materiais", protect, upload.single("file"), addMaterial);
router.get("/aulas/:aulaId/materiais", protect, getMateriaisByAula);
router.patch("/materiais/:id/archive", protect, toggleArchiveMaterial);

// /api/materiais/:id
router.put("/materiais/:id", protect, upload.single("file"), updateMaterial);

module.exports = router;
