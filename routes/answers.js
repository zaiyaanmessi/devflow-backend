const express = require('express');
const router = express.Router();
const Answer = require('../models/Answer');
const Question = require('../models/Question');
const User = require('../models/user');
const { protect } = require('../utils/auth');

// Create answer (protected)
router.post('/', protect, async (req, res) => {
  try {
    const { questionId, body } = req.body;

    if (!body) {
      return res.status(400).json({ error: 'Answer body is required' });
    }

    // Check if question exists
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const answer = await Answer.create({
      questionId,
      body,
      answerer: req.userId
    });

    const populatedAnswer = await Answer.findById(answer._id)
      .populate('answerer', 'username reputation role');

    res.status(201).json(populatedAnswer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Accept answer (protected - only question asker)
router.put('/:answerId/accept', protect, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.answerId);

    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    const question = await Question.findById(answer.questionId);

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Check if user is the question asker
    if (question.asker.toString() !== req.userId) {
      return res.status(403).json({ error: 'Only the question asker can accept answers' });
    }

    // Unaccept previous answer if exists
    if (question.acceptedAnswer) {
      const prevAnswer = await Answer.findById(question.acceptedAnswer);
      if (prevAnswer) {
        prevAnswer.isAccepted = false;
        await prevAnswer.save();

        // Remove reputation from previous answerer
        await User.findByIdAndUpdate(prevAnswer.answerer, {
          $inc: { reputation: -15 }
        });
      }
    }

    // Accept new answer
    answer.isAccepted = true;
    await answer.save();

    // Update question
    question.acceptedAnswer = answer._id;
    await question.save();

    // Add reputation to answerer
    await User.findByIdAndUpdate(answer.answerer, {
      $inc: { reputation: 15 }
    });

    const populatedAnswer = await Answer.findById(answer._id)
      .populate('answerer', 'username reputation role');

    res.json(populatedAnswer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update answer (protected - only answerer)
router.put('/:id', protect, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    // Check if user is the answerer
    if (answer.answerer.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to update this answer' });
    }

    const { body } = req.body;

    if (body) answer.body = body;
    answer.updatedAt = Date.now();

    await answer.save();

    const updatedAnswer = await Answer.findById(answer._id)
      .populate('answerer', 'username reputation role');

    res.json(updatedAnswer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete answer (protected - only answerer)
router.delete('/:id', protect, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    // Check if user is the answerer
    if (answer.answerer.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this answer' });
    }

    await answer.deleteOne();

    res.json({ message: 'Answer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;