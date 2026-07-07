// Import mongoose and its Schema constructor
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define Comment Sub-schema
// This schema will be used as an array of sub-documents inside the Post schema
const CommentSchema = new Schema({
  // Content of the comment
  content: {
    type: String,
    required: true,
  },
  // Author of the comment, referencing the User model
  author: {
    type: Schema.Types.ObjectId, // Use ObjectId to link to the User document
    ref: 'User', // Reference the 'User' model
    required: true,
  }
}, {
  // Automatically track createdAt and updatedAt for each comment
  timestamps: true,
});

// Define Post Schema
const PostSchema = new Schema({
  // ShortId for easy URL routing, similar to User shortId
  shortId: {
    type: String,
    required: true,
    unique: true,
    default: () => Math.random().toString(36).substring(2, 10), // Generate a random 8-character string
  },
  // Title of the post
  title: {
    type: String,
    required: true,
  },
  // Content/body of the post
  content: {
    type: String,
    required: true,
  },
  // Author of the post, referencing the User model
  author: {
    type: Schema.Types.ObjectId, // Link to User Document via ObjectId
    ref: 'User', // Reference the 'User' model
    required: true,
    index: true, // Create an index on 'author' field to improve query performance (e.g. finding posts by specific author)
  },
  // Comments array: embedding the CommentSchema as a sub-document array
  comments: [CommentSchema],
}, {
  // Automatically track createdAt and updatedAt for each post
  timestamps: true,
});

// Create and export the Post model based on the schema
module.exports = mongoose.model('Post', PostSchema);
