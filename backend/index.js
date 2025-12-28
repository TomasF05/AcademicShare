const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const disciplinaRoutes = require('./routes/disciplinaRoutes');
const aulaRoutes = require("./routes/aulaRoutes");

dotenv.config();

connectDB();

const app = express(); 

app.use(cors()); // permitir que o frontend aceda ao backend mesmo estando em dominios diferentes

app.use(express.json()); // transforma  os dados que chegam ( texto) num JSON. sem isto, o backend nao entenderia o que o frontend envia


app.use('/api/users', userRoutes);
app.use('/api/disciplinas', disciplinaRoutes);
app.use("/api", aulaRoutes);


app.get('/', (req, res) => {
    res.status(200).send('Academic Share a funcionar!');
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Servidor a correr na porta ${PORT}`);
});

