require('dotenv').config();
const mongoose = require('mongoose');
const DATABASE_URL = process.env.DATABASE_URL



mongoose.connect(DATABASE_URL, {
   serverSelectionTimeoutMS: 5000, // Timeout after 5s
   socketTimeoutMS: 45000 // Close sockets after 45s inactivity
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
