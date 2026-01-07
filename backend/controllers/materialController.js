const Material = require("../models/Material");

// Criar material
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

// Listar mateiais por aula
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

// Editar material (só quem criou ou admin)
const updateMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ message: "Material não encontrado" });
    }

    // Permissões
    if (
      material.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(401)
        .json({ message: "Não tens permissão para editar este material" });
    }

    const { titulo, descricao, tipo, link } = req.body;

    let url = material.url; // mantém o atual por defeito

    if (tipo === "file" && req.file) {
      url = `/uploads/${req.file.filename}`;
    }

    if (tipo === "link") {
      if (!link) {
        return res.status(400).json({ message: "Link em falta" });
      }
      url = link;
    }

    material.titulo = titulo ?? material.titulo;
    material.descricao = descricao ?? material.descricao;
    material.tipo = tipo ?? material.tipo;
    material.url = url;

    const materialAtualizado = await material.save();

    res.status(200).json(materialAtualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao atualizar material" });
  }
};

module.exports = {
  addMaterial,
  getMateriaisByAula,
  updateMaterial,
};
