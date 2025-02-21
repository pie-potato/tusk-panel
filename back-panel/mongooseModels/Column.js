const mongoose = require('mongoose')

const Column = new mongoose.Schema({
    title: { type: String, required: true },
    boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true }, // Add boardId
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
})

module.exports = mongoose.model('Column', Column)