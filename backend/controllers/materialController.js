const Material = require("../models/Material");

const addMaterial = async (req, res) => {
  try {
    const { titulo, descricao, tipo, link } = req.body;

    if (!titulo || !tipo) {
      return res.status(400).json({ message: "Campos obrigatórios em falta" });
    }

    let url = "";

    if (tipo === "file") {
      if (!req.file) {
        return res.status(400).json({ message: "Ficheiro não enviado" });
      }
      url = `/uploads/${req.file.filename}`;
    }

    if (tipo === "link") {
      if (!link) {
        return res.status(400).json({ message: "Link em falta" });
      }
      url = link;
    }

    const material = await Material.create({
      aula: req.params.aulaId,
      titulo,
      descricao,
      tipo,
      url,
      user: req.user.id,
    });

    res.status(201).json(material);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao adicionar material" });
  }
};

const getMateriaisByAula = async (req, res) => {
  try {
    const materiais = await Material.find({
      aula: req.params.aulaId,
    })
      .populate("user", "name") // Traz o nome do utilizador que submeteu o material
      .sort({ createdAt: -1 }); // Data de submissão

    res.status(200).json(materiais);
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter materiais" });
  }
};

module.exports = {
  addMaterial,
  getMateriaisByAula,
};
