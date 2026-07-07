const express = require('express');
const router = express.Router();

// GET home page.
router.get('/', (req, res) => {
  // Render the index.pug template
  // The 'user' variable is available in res.locals (set in app.js)
  res.render('index', { title: 'Playground Home' });
});

module.exports = router;
