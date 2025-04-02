require('dotenv').config();
const mongoose = require('mongoose');
const DATABASE_URL = process.env.DATABASE_URL



mongoose.connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('connected', () => {
    console.log(`Mongoose connected to ${DATABASE_URL}`);
});

db.on('error', (err) => {
    console.error(`Mongoose connection error: ${err}`);
});

db.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

module.exports = db;