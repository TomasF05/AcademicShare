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


module.exports = { registerUser, loginUser };