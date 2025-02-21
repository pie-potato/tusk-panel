const taskEvents = (socket) => {
    socket.on('addTask', (room, newTask) => {
        socket.to(room).emit('addTask', newTask);
    });
    socket.on('updateTask', (room, updateTask) => {
        socket.to(room).emit('updateTask', updateTask);
    });
    socket.on('deleteTask', (room, taskId) => { // Клиент обновил задачу
        socket.to(room).emit('deleteTask', taskId);
    });
}

module.exports = taskEvents