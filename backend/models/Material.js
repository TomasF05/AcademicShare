const mongoose = require("mongoose");

const materialSchema = mongoose.Schema(
  {
    aula: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Aula",
    },
    titulo: {
      type: String,
      required: true,
    },
    descricao: {
      type: String,
    },
    tipo: {
      type: String,
      enum: ["file", "link"],
      required: true,
    },
    url: {
      type: String,
      required: true, // link OU caminho do ficheiro
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Material", materialSchema);
