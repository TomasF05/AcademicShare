const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    aula: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Aula", // Liga a mensagem a uma aula específica
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Quem enviou
    },
    userName: {
      type: String, 
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    client_offset: {
      type: String, 
      unique: true, // evita mensagens duplicadas por causa de problemas de rede
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("Message", messageSchema);