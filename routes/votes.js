const express = require('express');
const router = express.Router();
const Vote = require('../models/Vote');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const User = require('../models/User');
const { protect } = require('../utils/auth');

// Vote on question or answer (protected)
router.post('/', protect, async (req, res) => {
  try {
    const { targetType, targetId, value } = req.body;

    // Validate input
    if (!['question', 'answer'].includes(targetType)) {
      return res.status(400).json({ error: 'Invalid target type' });
    }

    if (![1, -1].includes(value)) {
      return res.status(400).json({ error: 'Vote value must be 1 or -1' });
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

    // Check if user already voted
    const existingVote = await Vote.findOne({
      user: req.userId,
      targetType,
      targetId
    });

    if (existingVote) {
      // If same vote, remove it (toggle off)
      if (existingVote.value === value) {
        await existingVote.deleteOne();
        
        // Update vote count
        target.votes -= value;
        await target.save();

        // Update target author's reputation
        const authorId = targetType === 'question' ? target.asker : target.answerer;
        await User.findByIdAndUpdate(authorId, {
          $inc: { reputation: -value }
        });

        return res.json({ message: 'Vote removed', votes: target.votes });
      } else {
        // Change vote (upvote to downvote or vice versa)
        const diff = value - existingVote.value; // Will be 2 or -2
        
        existingVote.value = value;
        await existingVote.save();

        // Update vote count
        target.votes += diff;
        await target.save();

        // Update target author's reputation
        const authorId = targetType === 'question' ? target.asker : target.answerer;
        await User.findByIdAndUpdate(authorId, {
          $inc: { reputation: diff }
        });

        return res.json({ message: 'Vote updated', votes: target.votes });
      }
    }

    // Create new vote
    const vote = await Vote.create({
      user: req.userId,
      targetType,
      targetId,
      value
    });

    // Update vote count
    target.votes += value;
    await target.save();

    // Update target author's reputation
    const authorId = targetType === 'question' ? target.asker : target.answerer;
    await User.findByIdAndUpdate(authorId, {
      $inc: { reputation: value }
    });

    res.status(201).json({ message: 'Vote recorded', votes: target.votes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's vote on a specific target (protected)
router.get('/:targetType/:targetId', protect, async (req, res) => {
  try {
    const { targetType, targetId } = req.params;

    const vote = await Vote.findOne({
      user: req.userId,
      targetType,
      targetId
    });

    if (!vote) {
      return res.json({ voted: false, value: 0 });
    }

    res.json({ voted: true, value: vote.value });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;