const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => { // é uma função assincrona porque a conexao à BD pode demorar algum tempo
    try{
        const conexao = await mongoose.connect(MONGO_URI); 
        console.log(`MongoDB Connected: ${conexao.connection.host}`);
    
    }catch (error){
        console.error(`Erro: ${error.message}`);
        process.exit(1); // é utilizado o process.exit para terminar o servidor logo que haja um erro na conexao à BD
    }
};

// exporta a função para ser usada noutros ficheiros
module.exports = connectDB;