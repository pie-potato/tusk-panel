const projectEvents = (socket) => {
    socket.on('addProject', (room, newProject) => {
        socket.to(room).emit('addProject', newProject);
    });
    socket.on('deleteProject', (room, deletedProject) => {
        socket.to(room).emit('deleteProject', deletedProject);
    });
    socket.on('updateProject', (room, updatedProject) => {
        socket.to(room).emit('updateProject', updatedProject);
    });
}

module.exports = projectEvents