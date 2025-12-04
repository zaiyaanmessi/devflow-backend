const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.set('json spaces', 2);

// ⭐⭐⭐ ADD THIS - MANUAL CORS HEADERS ⭐⭐⭐
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  
  next();
});

app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✓ MongoDB connected'))
  .catch(err => console.log('MongoDB error:', err));

// Load models
const User = require('./models/user');
const Question = require('./models/Question');
const Answer = require('./models/Answer');
const Vote = require('./models/Vote');
const Comment = require('./models/Comment');

console.log('✓ All models loaded');

// Routes
const authRoutes = require('./routes/auth');
const questionRoutes = require('./routes/questions');
const answerRoutes = require('./routes/answers');
const voteRoutes = require('./routes/votes');
const commentRoutes = require('./routes/comments');
const userRoutes = require('./routes/users');

app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);

// IMPORTANT: Register answers as nested route under questions
// This allows requests like: POST /api/questions/:questionId/answers
app.use('/api/questions/:questionId/answers', answerRoutes);

app.use('/api/votes', voteRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
});