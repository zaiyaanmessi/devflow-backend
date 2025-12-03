const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const { protect } = require('../utils/auth');

// Create comment (protected)
router.post('/', protect, async (req, res) => {
  try {
    const { body, targetType, targetId } = req.body;

    if (!body) {
      return res.status(400).json({ error: 'Comment body is required' });
    }

    if (!['question', 'answer'].includes(targetType)) {
      return res.status(400).json({ error: 'Invalid target type' });
    }

    // Check if target exists
    let target;
    if (targetType === 'question') {
      target = await Question.findById(targetId);
    } else {
      target = await Answer.findById(targetId);
    }

    if (!target) {
      return res.status(404).json({ error: `${targetType} not found` });
    }

    const comment = await Comment.create({
      body,
      author: req.userId,
      targetType,
      targetId
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'username reputation');

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete comment (protected - only author)
router.delete('/:id', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Check if user is the author
    if (comment.author.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;