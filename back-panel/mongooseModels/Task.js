const mongoose = require('mongoose')

const Task = new mongoose.Schema({
    title: String,
    description: String,
    columnId: { type: mongoose.Schema.Types.ObjectId, ref: 'Column' },
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Add createdBy field
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],  //  New field for assigned user
    attachments: [{ filename: String, originalname: String }],
    startDate: { type: Date },
    endDate: { type: Date },
})

module.exports = mongoose.model('Task', Task)