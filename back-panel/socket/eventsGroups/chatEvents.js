const chatEvents = (socket) => {
    socket.on('createChat', (room, chat) => {
        socket.to(room).emit('createChat', chat);
    });
    socket.on('deleteChat', (room, deletedChat) => {
        socket.to(room).emit('deleteChat', deletedChat);
    });
}

module.exports = chatEvents