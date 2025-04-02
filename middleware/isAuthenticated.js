// isAuthenticated.js
const express = require("express");


// Middleware to check authentication
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next(); // User is logged in, proceed to next middleware/route
  } else {
    res.redirect("/login"); // Redirect to login if not logged in
  }
}

module.exports = isAuthenticated;
