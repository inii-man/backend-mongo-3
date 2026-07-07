const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');

// GET /users/:shortId/posts - List posts created by a specific user
// Follows RESTful conventions for nested resources
router.get('/:shortId/posts', async (req, res, next) => {
  try {
    const { shortId } = req.params;
    
    // Find the user by their shortId
    const user = await User.findOne({ shortId });
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Find all posts where the author field matches this user's ObjectID
    // populate() replaces the author ObjectID with the user document
    const posts = await Post.find({ author: user._id }).populate('author');

    // Reuse the 'posts/list' view, passing in the posts and the profile user
    // We pass 'profileUser' so the template knows we are viewing a specific user's posts
    res.render('posts/list', { posts, profileUser: user });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
