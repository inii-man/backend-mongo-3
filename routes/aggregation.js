const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// GET /aggregation - Example of MongoDB Aggregation Pipeline
router.get('/', async (req, res, next) => {
  try {
    // Perform an aggregation on the Post collection
    // This pipeline demonstrates $group, $match, and $lookup stages
    const results = await Post.aggregate([
      {
        // 1. Group posts by author and count them
        $group: {
          _id: '$author', // Group by the 'author' field (ObjectId)
          count: { $sum: 1 } // For each document in the group, add 1 to the 'count'
        }
      },
      {
        // 2. Filter the grouped results, finding authors with at least 1 post
        // (In the slide it was $gt: 10, but 1 is better for a small playground)
        $match: {
          count: { $gte: 1 }
        }
      },
      {
        // 3. Lookup the actual user document from the 'users' collection
        $lookup: {
          from: 'users', // Name of the target collection
          localField: '_id', // The field from the current stage (author's ObjectId)
          foreignField: '_id', // The field from the target collection (User's ObjectId)
          as: 'userInfo' // The array field to add to the output document
        }
      }
    ]);

    // Send the aggregation results as JSON
    res.json(results);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
