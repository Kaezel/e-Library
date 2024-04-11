const mongoose = require('mongoose');

// Create Schema
const Loginschema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // Ensures unique email addresses
    },
    password: {
        type: String,
        required: true
    }
});

// collection part
module.exports = mongoose.model("users", Loginschema);