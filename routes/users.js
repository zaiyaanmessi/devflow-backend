const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const { protect } = require('../utils/auth');

// Get user profile by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Count user's questions and answers
    const questionsCount = await Question.countDocuments({ asker: user._id });
    const answersCount = await Answer.countDocuments({ answerer: user._id });

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      reputation: user.reputation,
      role: user.role,
      createdAt: user.createdAt,
      questionsCount,
      answersCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile (protected - own profile only)
router.put('/:id', protect, async (req, res) => {
  try {
    // Check if user is updating their own profile
    if (req.params.id !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to update this profile' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { username, bio } = req.body;

    // Check if username is taken (if changing username)
    if (username && username !== user.username) {
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        return res.status(400).json({ error: 'Username already taken' });
      }
      user.username = username;
    }

    if (bio !== undefined) user.bio = bio;

    await user.save();

    const updatedUser = await User.findById(user._id).select('-password');

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's questions (public)
router.get('/:id/questions', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const questions = await Question.find({ asker: req.params.id })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('asker', 'username reputation');

    const count = await Question.countDocuments({ asker: req.params.id });

    // Count answers for each question
    const questionsWithAnswers = await Promise.all(
      questions.map(async (question) => {
        const answerCount = await Answer.countDocuments({ questionId: question._id });
        return {
          ...question.toObject(),
          answerCount
        };
      })
    );

    res.json({
      questions: questionsWithAnswers,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's answers (public)
router.get('/:id/answers', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const answers = await Answer.find({ answerer: req.params.id })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('answerer', 'username reputation')
      .populate('questionId', 'title');

    const count = await Answer.countDocuments({ answerer: req.params.id });

    res.json({
      answers,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;