const mongoose = require('mongoose')

const Project = new mongoose.Schema({
    title: { type: String, required: true },
    members: { type: mongoose.Schema.Types.Array, ref: 'User' }
})

module.exports = mongoose.model("Project", Project)