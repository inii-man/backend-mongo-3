const express = require('express');
const router = express.Router();
const crypto = require('crypto'); // Built-in crypto module for hashing
const passport = require('passport'); // Passport for handling login authentication
const User = require('../models/User'); // Import User model

// Helper function to hash passwords using SHA1
function getHash(password) {
  const hash = crypto.createHash('sha1');
  hash.update(password);
  return hash.digest('hex');
}

// GET /join - Render the membership registration page
router.get('/join', (req, res) => {
  res.render('signup'); // Render views/signup.pug
});

// POST /join - Handle the registration request
router.post('/join', async (req, res, next) => {
  try {
    // Extract email, name, and password from the submitted form body
    const { email, name, password } = req.body;
    
    // Hash the password before storing it
    const pwHash = getHash(password);

    // Check if a user with this email already exists
    const exists = await User.findOne({ email });
    if (exists) {
      // If user exists, throw an error
      throw new Error('This email is already registered');
    }

    // Create the new user in the database
    await User.create({
      email,
      name,
      password: pwHash, // Store the hashed password
    });

    // Redirect to the home page after successful registration
    res.redirect('/');
  } catch (err) {
    next(err); // Pass error to express error handler
  }
});

// GET /auth - Render the login page
router.get('/auth', (req, res) => {
  res.render('login'); // Render views/login.pug
});

// POST /auth - Handle the login request using Passport
// Passport automatically uses the assigned 'local' strategy and generates a request handler
router.post('/auth', passport.authenticate('local', {
  successRedirect: '/', // Redirect to home page on successful login
  failureRedirect: '/auth', // Redirect back to login page on failure
}));

// GET /logout - Handle logout request
router.get('/logout', (req, res, next) => {
  // req.logout() is provided by Passport to terminate the login session
  req.logout((err) => {
    if (err) { return next(err); }
    // Redirect to home page after logging out
    res.redirect('/');
  });
});

module.exports = router;
