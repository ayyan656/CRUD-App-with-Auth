const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth-routes.js");
const mydb = require("./config/db"); 
const User = require('./models/user');
const isAuthenticated = require("./middleware/isAuthenticated");
const bcrypt = require("bcrypt");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);


// MongoDB Session Store
const store = new MongoDBStore({
    uri: process.env.DATABASE_URL,  // Your MongoDB connection string
    collection: "sessions"
});

// Handle store errors
store.on("error", function (error) {
    console.log("SESSION STORE ERROR:", error);
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());

// Express Session Middleware (Now using MongoDB)
app.use(session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    store: store, // Stores session in MongoDB
    cookie: {
        secure: false, // Set to `true` in production with HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

const PORT = process.env.PORT || 3000;
app.use("/auth", authRoutes);

// Signup Route
app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "Public", "index.html"));
});

// Login Route
app.get("/login", (req, res) => {
  if (!req.session.user) {
    res.sendFile(path.join(__dirname, "Public", "server.html"));
  } else {
    res.redirect("/dashboard");
  }
});

app.get("/auth/status", (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true });
    } else {
    res.json({ loggedIn: false });
    }
});

// Dashboard Route (Fixed)
app.get("/dashboard", isAuthenticated, (req, res) => {
  if (req.session.user) {
    res.sendFile(path.join(__dirname, "Public", "dashboard.html"));
  } else {
    res.redirect("/login");
  }
});





// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
