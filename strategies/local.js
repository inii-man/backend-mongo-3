// Import Passport LocalStrategy
const LocalStrategy = require('passport-local').Strategy;
// Import crypto module for hashing passwords (as instructed in the PDF using SHA1)
const crypto = require('crypto');
// Import User model to interact with the users collection in MongoDB
const User = require('../models/User');

// Helper function to hash passwords using SHA1
// Note: In real-world apps, use more secure algorithms like bcrypt or argon2. 
// We use SHA1 here to match the provided course material.
function getHash(password) {
  const hash = crypto.createHash('sha1'); // Create SHA1 hash object
  hash.update(password); // Update the hash with the provided password
  return hash.digest('hex'); // Return the hex representation of the hash
}

// Configuration object for LocalStrategy
const config = {
  usernameField: 'email', // Define that the login username field is called 'email' in the form
  passwordField: 'password', // Define that the password field is called 'password' in the form
};

// Create a new LocalStrategy instance
const local = new LocalStrategy(config, async (email, password, done) => {
  try {
    // Attempt to find a user with the provided email
    const user = await User.findOne({ email });
    
    // If no user is found with this email, authentication fails
    if (!user) {
      return done(null, false, { message: 'The member could not be found.' });
    }

    // Hash the provided password to compare with the stored hash
    const pwHash = getHash(password);

    // If the hashed provided password does not match the stored user password, authentication fails
    if (user.password !== pwHash) {
      return done(null, false, { message: 'The password does not match.' });
    }

    // Authentication is successful, pass the user object to passport
    return done(null, user);
  } catch (err) {
    // If an error occurs during the process (e.g. database error), pass the error to passport
    return done(err);
  }
});

// Export the strategy so it can be registered in app.js
module.exports = local;
