const { Server } = require('socket.io');
const SocketEvents = require('./SocketEvents');

let io;

const initializeWebSocketServer = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: "*", //  или ваш домен/порт клиента
            methods: ["GET", "POST", "PUT", "DELETE"],
            credentials: true
        },
        transports: ['websocket', 'polling']
    })
    SocketEvents(io)
}

const emitEventToRoom = (room, event, data) => {
    if (!io) {
        console.error("Сокет не создан.")
        return;
    }
    io.to(room).emit(event, data)
}

module.exports = socketServise = {
    initializeWebSocketServer: initializeWebSocketServer,
    emitEventToRoom: emitEventToRoom
}