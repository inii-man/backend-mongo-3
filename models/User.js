// Import mongoose to create schemas
const mongoose = require('mongoose');

// Define the User Schema
const UserSchema = new mongoose.Schema({
  // Email field: required and must be unique
  email: {
    type: String,
    required: true,
    unique: true,
  },
  // Name field: required string
  name: {
    type: String,
    required: true,
  },
  // Password field: will store the hashed password, not plain text
  password: {
    type: String,
    required: true,
  },
  // shortId field: a unique string to easily identify users in URLs instead of full ObjectId
  shortId: {
    type: String,
    required: true,
    unique: true,
    default: () => Math.random().toString(36).substring(2, 10), // Generate a random 8-character string as shortId
  }
}, {
  // Automatically manage createdAt and updatedAt timestamps
  timestamps: true,
});

// Create and export the User model based on the schema
module.exports = mongoose.model('User', UserSchema);
