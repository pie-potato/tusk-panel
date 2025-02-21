const attachmentsFileEvents = (socket) => {
    socket.on('addAttachmentsFile', (room, attachmentsFile) => { // Клиент обновил задачу
        socket.to(room).emit('addAttachmentsFile', attachmentsFile);
    });
    socket.on('deleteAttachmentsFile', (room, deletedAttachmentsFile) => { // Клиент обновил задачу
        socket.to(room).emit('deleteAttachmentsFile', deletedAttachmentsFile);
    });
}

module.exports = attachmentsFileEvents