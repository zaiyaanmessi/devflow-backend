const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.set('json spaces', 2);

// ⭐ PRODUCTION-READY CORS ⭐
const allowedOrigins = [
  'http://localhost:3000',           // Local development
  'https://your-vercel-domain.vercel.app', // Will update this after Vercel deployment
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Allow requests from allowed origins
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
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
const User = require('./models/User');
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
app.use('/api/questions/:questionId/answers', answerRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is running!', environment: process.env.NODE_ENV });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
});