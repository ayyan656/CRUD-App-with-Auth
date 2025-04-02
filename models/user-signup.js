const mongoose = require('mongoose');

const signupUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const signupUser = mongoose.model('SignupUser', signupUserSchema);
module.exports = signupUser