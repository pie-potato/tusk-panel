const boardEvents = (socket) => {
    socket.on('addBoard', (room, newBoard) => {
        socket.to(room).emit('addBoard', newBoard);
    });
    socket.on('deleteBoard', (room, deletedBoard) => {
        socket.to(room).emit('deleteBoard', deletedBoard);
    });
    socket.on('updateBoard', (room, updateBoard) => {
        socket.to(room).emit('updateBoard', updateBoard);
    });
}

module.exports = boardEvents