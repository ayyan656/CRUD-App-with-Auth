const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number
    },
    gender: {
        type: String
    },
    image: {
        type: String
    }
}, { timestamps: true });


const user = mongoose.model('user', userSchema);
module.exports = user;

// {
//     "name": "ayyan",
//     "username": "ayyan934",
//     "email": "ayyan234@gmail.com",
//     "password": "ayyan@890#",
//     "age": 24,
//     "gender": "Male"
// }