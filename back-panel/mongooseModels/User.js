const mongoose = require("mongoose");

const User = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstname: { type: String, required: true }, // Add nickname field
    secondname: { type: String, required: true }, // Add nickname field
    thirdname: { type: String }, // Add nickname field
    mail: { type: String },
    role: { type: String, enum: ['admin', 'manager', 'employee'], default: 'employee' } // Add role field
})

module.exports = mongoose.model('User', User)