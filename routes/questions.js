const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const Comment = require('../models/Comment');
const User = require('../models/User');
const { protect, optionalAuth } = require('../utils/auth');

// Get all questions (public)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, tags, sort = 'newest' } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { body: { $regex: search, $options: 'i' } }
      ];
    }

    if (tags) {
      const tagArray = tags.split(',');
      query.tags = { $in: tagArray };
    }

    let sortOption = {};
    if (sort === 'newest') {
      sortOption = { isPinned: -1, createdAt: -1 };
    } else if (sort === 'votes') {
      sortOption = { isPinned: -1, votes: -1 };
    } else if (sort === 'views') {
      sortOption = { isPinned: -1, views: -1 };
    } else {
      // Default sorting - pinned first
      sortOption = { isPinned: -1, createdAt: -1 };
    }

    const questions = await Question.find(query)
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('asker', 'username reputation')
      .exec();

    const count = await Question.countDocuments(query);

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
router.get('/:id', optionalAuth ,async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('asker', 'username reputation role');

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Initialize viewers array if it doesn't exist (for old questions)
    if (!question.viewers) {
      question.viewers = [];
    }

    // Only increment views if user is logged in AND hasn't viewed before
    if (req.userId) {
      // Check if this user has already viewed this question
      const hasViewed = question.viewers.some(viewer => viewer.toString() === req.userId.toString());

      if (!hasViewed) {
        // User hasn't viewed before, so add them and increment views
        question.viewers.push(req.userId);
        question.views += 1;
      }
      // If they have viewed before, don't increment
    }
    // If not logged in (anonymous), we don't count the view

    await question.save();

    const answers = await Answer.find({ questionId: question._id })
      .populate('answerer', 'username reputation role')
      .populate('verifiedBy', 'username role')
      .sort({ isAccepted: -1, votes: -1 });

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
      asker: req.userId,
      viewers: [req.userId]
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

    const user = await User.findById(req.userId);

    if (question.asker.toString() !== req.userId && user.role !== 'admin') {
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

    const user = await User.findById(req.userId);

    if (question.asker.toString() !== req.userId && user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this question' });
    }

    await Answer.deleteMany({ questionId: question._id });
    await Comment.deleteMany({ targetType: 'question', targetId: question._id });

    await question.deleteOne();

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ ANSWER ROUTES ============

// Create answer (protected)
router.post('/:id/answers', protect, async (req, res) => {
  try {
    const { body } = req.body;

    if (!body) {
      return res.status(400).json({ error: 'Answer body is required' });
    }

    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const answer = await Answer.create({
      body,
      questionId: req.params.id,
      answerer: req.userId
    });

    const populatedAnswer = await Answer.findById(answer._id)
      .populate('answerer', 'username reputation role');

    res.status(201).json(populatedAnswer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update answer (protected - only answerer)
router.put('/:id/answers/:answerId', protect, async (req, res) => {
  try {
    const { body } = req.body;

    if (!body) {
      return res.status(400).json({ error: 'Answer body is required' });
    }

    const answer = await Answer.findById(req.params.answerId);

    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    if (answer.answerer.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to update this answer' });
    }

    answer.body = body;
    answer.updatedAt = Date.now();
    await answer.save();

    const updatedAnswer = await Answer.findById(answer._id)
      .populate('answerer', 'username reputation role');

    res.json(updatedAnswer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete answer (protected - only answerer or admin)
router.delete('/:id/answers/:answerId', protect, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.answerId);

    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    const user = await User.findById(req.userId);

    if (answer.answerer.toString() !== req.userId && user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this answer' });
    }

    await answer.deleteOne();
    await Comment.deleteMany({ targetType: 'answer', targetId: req.params.answerId });

    res.json({ message: 'Answer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// VOTING ROUTES 

// UPVOTE QUESTION (protected)
router.post('/:id/upvote', protect, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    if (question.asker.toString() === req.userId) {
      return res.status(400).json({ error: 'You cannot vote on your own question' });
    }

    question.votes += 1;
    await question.save();

    const updatedQuestion = await Question.findById(question._id)
      .populate('asker', 'username reputation');

    res.json({
      message: 'Question upvoted successfully',
      question: updatedQuestion
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DOWNVOTE QUESTION (protected)
router.post('/:id/downvote', protect, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    if (question.asker.toString() === req.userId) {
      return res.status(400).json({ error: 'You cannot vote on your own question' });
    }

    question.votes -= 1;
    await question.save();

    const updatedQuestion = await Question.findById(question._id)
      .populate('asker', 'username reputation');

    res.json({
      message: 'Question downvoted successfully',
      question: updatedQuestion
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPVOTE ANSWER (protected)
router.post('/:id/answers/:answerId/upvote', protect, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.answerId);

    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    if (answer.answerer.toString() === req.userId) {
      return res.status(400).json({ error: 'You cannot vote on your own answer' });
    }

    answer.votes += 1;
    await answer.save();

    const updatedAnswer = await Answer.findById(answer._id)
      .populate('answerer', 'username reputation role');

    res.json({
      message: 'Answer upvoted successfully',
      answer: updatedAnswer
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DOWNVOTE ANSWER (protected)
router.post('/:id/answers/:answerId/downvote', protect, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.answerId);

    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    if (answer.answerer.toString() === req.userId) {
      return res.status(400).json({ error: 'You cannot vote on your own answer' });
    }

    answer.votes -= 1;
    await answer.save();

    const updatedAnswer = await Answer.findById(answer._id)
      .populate('answerer', 'username reputation role');

    res.json({
      message: 'Answer downvoted successfully',
      answer: updatedAnswer
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ACCEPT ANSWER 

// ACCEPT ANSWER (protected - only question asker can accept)
router.put('/:id/answers/:answerId/accept', protect, async (req, res) => {
  try {
    const { id, answerId } = req.params;

    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    if (question.asker.toString() !== req.userId) {
      return res.status(403).json({ error: 'Only the question asker can accept answers' });
    }

    const answer = await Answer.findById(answerId);
    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    if (answer.questionId.toString() !== id) {
      return res.status(400).json({ error: 'Answer does not belong to this question' });
    }

    // If there's already an accepted answer, unaccept it
    if (question.acceptedAnswer) {
      const oldAcceptedAnswer = await Answer.findById(question.acceptedAnswer);
      if (oldAcceptedAnswer) {
        oldAcceptedAnswer.isAccepted = false;
        await oldAcceptedAnswer.save();
      }
    }

    // Mark this answer as accepted
    answer.isAccepted = true;
    await answer.save();

    // Update question with accepted answer
    question.acceptedAnswer = answerId;
    await question.save();

    const updatedAnswer = await Answer.findById(answerId)
      .populate('answerer', 'username reputation role');

    res.json({
      message: 'Answer accepted successfully',
      answer: updatedAnswer
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//  EXPERT FEATURES 

// PIN QUESTION (protected - only expert or admin can pin their own questions)
router.post('/:id/pin', protect, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Check if user is expert or admin
    const user = await User.findById(req.userId);
    if (user.role !== 'expert' && user.role !== 'admin') {
      return res.status(403).json({ error: 'Only experts and admins can pin questions' });
    }

    // Check if user is the question asker (for non-admins)
    if (user.role !== 'admin' && question.asker.toString() !== req.userId) {
      return res.status(403).json({ error: 'You can only pin your own questions' });
    }

    // Pin the question
    question.isPinned = true;
    await question.save();

    const updatedQuestion = await Question.findById(question._id)
      .populate('asker', 'username reputation role');

    res.json({
      message: 'Question pinned successfully',
      question: updatedQuestion
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UNPIN QUESTION (protected - only expert or admin can unpin their own questions)
router.post('/:id/unpin', protect, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Check if user is expert or admin
    const user = await User.findById(req.userId);
    if (user.role !== 'expert' && user.role !== 'admin') {
      return res.status(403).json({ error: 'Only experts and admins can unpin questions' });
    }

    // Check if user is the question asker (for non-admins)
    if (user.role !== 'admin' && question.asker.toString() !== req.userId) {
      return res.status(403).json({ error: 'You can only unpin your own questions' });
    }

    // Unpin the question
    question.isPinned = false;
    await question.save();

    const updatedQuestion = await Question.findById(question._id)
      .populate('asker', 'username reputation role');

    res.json({
      message: 'Question unpinned successfully',
      question: updatedQuestion
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// VERIFY ANSWER (protected - only expert or admin can verify answers)
router.post('/:id/answers/:answerId/verify', protect, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.answerId);

    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    // Check if user is expert or admin
    const user = await User.findById(req.userId);
    if (user.role !== 'expert' && user.role !== 'admin') {
      return res.status(403).json({ error: 'Only experts and admins can verify answers' });
    }

    // Experts cannot verify their own answers
    if (user.role === 'expert' && answer.answerer.toString() === req.userId) {
      return res.status(403).json({ error: 'You cannot verify your own answers' });
    }

    // Verify the answer
    answer.isVerified = true;
    answer.verifiedBy = req.userId;
    await answer.save();

    const updatedAnswer = await Answer.findById(answer._id)
      .populate('answerer', 'username reputation role')
      .populate('verifiedBy', 'username role');

    res.json({
      message: 'Answer verified successfully',
      answer: updatedAnswer
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UNVERIFY ANSWER (protected - only the expert/admin who verified can unverify)
router.post('/:id/answers/:answerId/unverify', protect, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.answerId);

    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    // Check if user is expert or admin
    const user = await User.findById(req.userId);
    if (user.role !== 'expert' && user.role !== 'admin') {
      return res.status(403).json({ error: 'Only experts and admins can unverify answers' });
    }

    // Check if user is the one who verified it (or is admin)
    if (user.role !== 'admin' && answer.verifiedBy?.toString() !== req.userId) {
      return res.status(403).json({ error: 'Only the verifier can unverify this answer' });
    }

    // Unverify the answer
    answer.isVerified = false;
    answer.verifiedBy = null;
    await answer.save();

    const updatedAnswer = await Answer.findById(answer._id)
      .populate('answerer', 'username reputation role');

    res.json({
      message: 'Answer unverified successfully',
      answer: updatedAnswer
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;