const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');

// Middleware to verify if a user is logged in
// If not logged in, they are redirected to the home page
function loginRequired(req, res, next) {
  if (!req.user) {
    res.redirect('/');
    return;
  }
  next();
}

// GET /posts - Display all posts
router.get('/', async (req, res, next) => {
  try {
    // Find all posts and populate the 'author' field
    // populate() replaces the ObjectID in 'author' with the actual User document
    const posts = await Post.find({}).populate('author');
    
    // Render the list of posts, passing the posts data
    res.render('posts/list', { posts });
  } catch (err) {
    next(err);
  }
});

// Apply the loginRequired middleware to all routes below this line
// Users must be logged in to create, edit, or delete posts
router.use(loginRequired);

// GET /posts/create - Render the form to create a new post
router.get('/create', (req, res) => {
  res.render('posts/create');
});

// POST /posts - Handle the creation of a new post
router.post('/', async (req, res, next) => {
  try {
    const { title, content } = req.body;
    
    // Search for the full user document using the shortId stored in the session (req.user)
    const author = await User.findOne({ shortId: req.user.shortId });
    if (!author) {
      throw new Error('No User');
    }

    // Create the post, associating it with the author
    await Post.create({
      title,
      content,
      author: author._id, // Assign the ObjectID of the author
    });

    res.redirect('/posts'); // Redirect back to the post list
  } catch (err) {
    next(err);
  }
});

// GET /posts/:shortId - View a specific post details
router.get('/:shortId', async (req, res, next) => {
  try {
    const { shortId } = req.params;
    // Find the post by its shortId and populate the author info
    const post = await Post.findOne({ shortId }).populate('author');
    
    if (!post) {
      return res.status(404).send('Post not found');
    }

    res.render('posts/view', { post });
  } catch (err) {
    next(err);
  }
});

// POST /posts/:shortId/delete - Handle deleting a post
router.post('/:shortId/delete', async (req, res, next) => {
  try {
    const { shortId } = req.params;
    // Find the post and populate the author to verify ownership
    const post = await Post.findOne({ shortId }).populate('author');
    
    // Verify that the logged-in user matches the author of the post
    if (post.author.shortId !== req.user.shortId) {
      throw new Error('Not Authorized');
    }

    // Delete the post
    await Post.deleteOne({ shortId });
    res.redirect('/posts');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
