const mongoose = require('mongoose');

// Create Schema
const Loginschema = new mongoose.Schema({
    name: {
        type:String,
        required: false
    },
    email: {
        type: String,
        required: 'This field is required.',
        unique: true
    },
    password: {
        type: String,
        required: false
    },
    securityQuestion: {
        type:String,
        required: false
    },
});

// collection part
module.exports = mongoose.model("users", Loginschema);