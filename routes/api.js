const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');

// Middleware to check if user is logged in before allowing them to post a comment
function loginRequired(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// POST /api/posts/:shortId/comments - Create a new comment via CSR
// Returns JSON instead of rendering an HTML page
router.post('/posts/:shortId/comments', loginRequired, async (req, res, next) => {
  try {
    const { shortId } = req.params;
    const { content } = req.body;
    
    // Find the full User document of the currently logged-in user
    const author = await User.findOne({ shortId: req.user.shortId });
    if (!author) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Use $push operator to add the new comment to the comments array
    // This allows simultaneous requests to be processed accurately without race conditions
    await Post.updateOne(
      { shortId },
      { 
        $push: { 
          comments: { 
            content, 
            author: author._id 
          } 
        } 
      }
    );

    // Respond with JSON indicating success
    res.json({ result: 'success' });
  } catch (err) {
    next(err);
  }
});

// GET /api/posts/:shortId/comments - Retrieve comments for a post via CSR
router.get('/posts/:shortId/comments', async (req, res, next) => {
  try {
    const { shortId } = req.params;
    
    // Find the post
    const post = await Post.findOne({ shortId });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Mongoose allows populating sub-documents.
    // Here we populate the 'author' field inside each comment in the 'comments' array
    await User.populate(post.comments, {
      path: 'author'
    });

    // Send the populated comments array back as JSON
    res.json(post.comments);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
