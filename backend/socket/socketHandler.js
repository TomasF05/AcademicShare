const { Server } = require('socket.io');
const Message = require('../models/Message');

const setupSocket = (server) => {
 const io = new Server(server, {
    connectionStateRecovery: {}, 
    cors: { origin: "*" }
  });

  io.on('connection', (socket) => {
    const aulaId = socket.handshake.query.aulaId;
    if (aulaId) {
      socket.join(aulaId);
      console.log(`Utilizador ${socket.id} entrou na aula: ${aulaId}`);
    }

    socket.on('chat message', async (msgData, clientOffset, callback) => {
 
        try {
            const newMessage = await Message.create({
            aula: msgData.aulaId,
            user: msgData.userId,
            userName: msgData.userName,
            content: msgData.texto,

            client_offset: clientOffset || `fallback-${socket.id}-${Date.now()}`
            });

            io.to(msgData.aulaId).emit('chat message', newMessage);

            if (callback) callback();
        } catch (e) {
            console.error("ERRO CRÍTICO NO MONGO:", e.message);
            if (callback) callback();
        }
});

    socket.on('disconnect', () => {
      console.log('Utilizador saiu');
    });
  });

  return io;
};

module.exports = setupSocket;