const taskAssingEvents = (socket) => {
    socket.on('addTaskAssing ', (room, assignedUser) => { // Клиент обновил задачу
        socket.to(room).emit('addTaskAssing', assignedUser);
    });
    socket.on('deleteTaskAssing', (room, unAssignedUser) => { // Клиент обновил задачу
        socket.to(room).emit('deleteTaskAssing', unAssignedUser);
    });
}

module.exports = taskAssingEvents