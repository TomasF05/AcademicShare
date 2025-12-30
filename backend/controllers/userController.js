const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', 
    });
};

const registerUser = async (req, res) => {
    try{
        const { name, email, password} = req.body;

        const userExists = await User.findOne({ email });

        if(userExists){
            return res.status(400).json({ message: 'Esse email já está registado' });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            token: generateToken(newUser.id)
        });
    }catch (error){
        console.error(error);
        res.status(500).json({ message: error.message});
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await bcryptjs.compare(password, user.password))) {
            
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id) 
            });

        } else {
            res.status(401).json({ message: 'Email ou password inválidos' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const getMe = async (req, res) => {
  try {
    // O req.user é preenchido pelo middleware 'protect'
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter dados do utilizador' });
  }
};

const updatePassword = async (req, res) => {
  const { passwordAntiga, novaPassword } = req.body;

  try {
    // Verificar se o utilizador existe (req.user vem do authMiddleware)
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: "Utilizador não encontrado." });
    }

    // CORREÇÃO: Usar bcryptjs em vez de bcrypt
    const isMatch = await bcryptjs.compare(passwordAntiga, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: "A password atual está incorreta." });
    }

    // Gerar novo salt e encriptar a nova password
    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(novaPassword, salt);
    
    await user.save();
    res.json({ message: "Password atualizada com sucesso!" });
    
  } catch (error) {
    console.error("Erro ao atualizar password:", error);
    res.status(500).json({ message: "Erro interno no servidor." });
  }
};

module.exports = { registerUser, loginUser, getMe, updatePassword};