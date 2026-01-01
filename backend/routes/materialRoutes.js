const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  addMaterial,
  getMateriaisByAula,
} = require("../controllers/materialController");

// /api/aulas/:aulaId/materiais
router.post(
  "/aulas/:aulaId/materiais",
  protect,
  upload.single("file"),
  addMaterial
);

router.get(
  "/aulas/:aulaId/materiais",
  protect,
  getMateriaisByAula
);

module.exports = router;
