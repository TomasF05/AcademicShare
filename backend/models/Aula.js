const mongoose = require("mongoose");

const aulaSchema = mongoose.Schema({
  disciplina: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Disciplina",
  },
  titulo: {
    type: String,
    required: true,
  },
  descricao: {
    type: String,
    required: true,
  },
  data: {
    type: Date,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  isArchived: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model("Aula", aulaSchema);
