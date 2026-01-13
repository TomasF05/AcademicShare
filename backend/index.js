const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const disciplinaRoutes = require('./routes/disciplinaRoutes');
const aulaRoutes = require("./routes/aulaRoutes");
const materialRoutes = require("./routes/materialRoutes");
const http = require('http'); 
const setupSocket = require('./socket/socketHandler'); 


dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app); 

// Inicializa o Socket.io passando o servidor http
setupSocket(server);

app.use(cors()); // permitir que o frontend aceda ao backend mesmo estando em dominios diferentes

app.use(express.json()); // transforma  os dados que chegam ( texto) num JSON. sem isto, o backend nao entenderia o que o frontend envia

app.use("/uploads", express.static("uploads")); // para servir os ficheiros

app.use('/api/users', userRoutes);
app.use('/api/disciplinas', disciplinaRoutes);
app.use("/api", aulaRoutes);
app.use("/api", materialRoutes);



app.get('/', (req, res) => {
    res.status(200).send('Academic Share a funcionar!');
});

const PORT = process.env.PORT;

server.listen(PORT, () => {
    console.log(`Servidor e chat a correr na porta ${PORT}`);
});

