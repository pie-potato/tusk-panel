const columnEvents = (socket) => {
    socket.on('addColumn', (room, newColumn) => {
        socket.to(room).emit('addColumn', newColumn);
    });
    socket.on('updateColumn', (room, updateColumn) => { // Клиент обновил задачу
        socket.to(room).emit('updateColumn', updateColumn);
    });
    socket.on('deleteColumn', (room, columnId) => { // получаем boardId вместе с columnId
        socket.to(room).emit('deleteColumn', columnId);
    });
}

module.exports = columnEvents