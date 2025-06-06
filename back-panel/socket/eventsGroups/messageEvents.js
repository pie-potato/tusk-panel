const messageEvents = (socket) => {
    socket.on('sendMessage', async (room, sendedMessage) => {
        socket.to(room).emit('sendMessage', sendedMessage);
    });
    socket.on('deleteMessage', (room, deletedMessage) => { // получаем boardId вместе с columnId
        socket.to(room).emit('deleteMessage', deletedMessage);
    });
    socket.on('readMessage', (room, readMessage) => { // получаем boardId вместе с columnId
        socket.to(room).emit('readMessage', readMessage);
    });
}

module.exports = messageEvents