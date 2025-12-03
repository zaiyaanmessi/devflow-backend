const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const Comment = require('../models/Comment');
const { protect } = require('../utils/auth');

// Get all questions (public)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, tags, sort = 'newest' } = req.query;

    // Build query
    let query = {};

    // Search by title or body
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { body: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by tags
    if (tags) {
      const tagArray = tags.split(',');
      query.tags = { $in: tagArray };
    }

    // Sort options
    let sortOption = {};
    if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    } else if (sort === 'votes') {
      sortOption = { votes: -1 };
    } else if (sort === 'views') {
      sortOption = { views: -1 };
    }

    // Execute query with pagination
    const questions = await Question.find(query)
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('asker', 'username reputation')
      .exec();

    // Count total questions
    const count = await Question.countDocuments(query);

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

// Get single question by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('asker', 'username reputation role');

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Increment view count
    question.views += 1;
    await question.save();

    // Get answers with their comments
    const answers = await Answer.find({ questionId: question._id })
      .populate('answerer', 'username reputation role')
      .sort({ isAccepted: -1, votes: -1 });

    // Get comments for each answer
    const answersWithComments = await Promise.all(
      answers.map(async (answer) => {
        const comments = await Comment.find({
          targetType: 'answer',
          targetId: answer._id
        })
          .populate('author', 'username reputation')
          .sort({ createdAt: 1 });

        return {
          ...answer.toObject(),
          comments
        };
      })
    );

    // Get comments for the question
    const questionComments = await Comment.find({
      targetType: 'question',
      targetId: question._id
    })
      .populate('author', 'username reputation')
      .sort({ createdAt: 1 });

    res.json({
      ...question.toObject(),
      answers: answersWithComments,
      comments: questionComments
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create question (protected)
router.post('/', protect, async (req, res) => {
  try {
    const { title, body, tags } = req.body;

    if (!title || !body) {
      return res.status(400).json({ error: 'Title and body are required' });
    }

    const question = await Question.create({
      title,
      body,
      tags: tags || [],
      asker: req.userId
    });

    const populatedQuestion = await Question.findById(question._id)
      .populate('asker', 'username reputation');

    res.status(201).json(populatedQuestion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update question (protected - only asker or admin)
router.put('/:id', protect, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Check if user is the asker
    if (question.asker.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to update this question' });
    }

    const { title, body, tags } = req.body;

    if (title) question.title = title;
    if (body) question.body = body;
    if (tags) question.tags = tags;
    question.updatedAt = Date.now();

    await question.save();

    const updatedQuestion = await Question.findById(question._id)
      .populate('asker', 'username reputation');

    res.json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete question (protected - only asker or admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Check if user is the asker
    if (question.asker.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this question' });
    }

    // Delete associated answers and comments
    await Answer.deleteMany({ questionId: question._id });
    await Comment.deleteMany({ targetType: 'question', targetId: question._id });

    await question.deleteOne();

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;