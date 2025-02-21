const attachmentsFileEvents = require("./eventsGroups/attachmentsFileevents");
const boardEvents = require("./eventsGroups/boardEvents");
const columnEvents = require("./eventsGroups/columnEvents");
const projectEvents = require("./eventsGroups/projectevents");
const taskAssingEvents = require("./eventsGroups/taskAssingEvents");
const taskEvents = require("./eventsGroups/taslEvents");

const SocketEvents = (io) => {
    io.on('connection', (socket) => { // Подключение нового клиента
        console.log('Пользователь подключился');

        socket.on('joinRoom', (room) => { // Клиент присоединяется к комнате доски
            socket.join(room);
            console.log(`Socket ${socket.id} joined room ${room}`);
        });
        columnEvents(socket)
        taskEvents(socket)
        taskAssingEvents(socket)
        attachmentsFileEvents(socket)
        boardEvents(socket)
        projectEvents(socket)
        socket.on('leaveRoom', (room) => {
            socket.leave(room);
            console.log(`user left room: ${room}`);
        });
        socket.on('disconnect', () => { // Отключение клиента
            console.log('Пользователь отключился');
        });
    });
}

module.exports = SocketEvents