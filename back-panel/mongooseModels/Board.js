const mongoose = require('mongoose')

const Board = new mongoose.Schema({
    title: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    column: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Column' }],
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true }
})

module.exports = mongoose.model('Board', Board)