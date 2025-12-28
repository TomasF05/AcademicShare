const mongoose = require("mongoose");

const materialSchema = mongoose.Schema({
  aula: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Aula",
  },
  titulo: {
    type: String,
    required: true,
  },
  tipo: {
    type: String,
    enum: ["pdf", "doc", "imagem", "link"],
    required: true,
  },
  ficheiroUrl: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Material", materialSchema);
