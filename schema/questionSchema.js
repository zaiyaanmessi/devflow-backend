const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  asker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tags: [String],
  votes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  viewers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  acceptedAnswer: { type: mongoose.Schema.Types.ObjectId, ref: 'Answer' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isLocked: { type: Boolean, default: false },
  isPinned: { type: Boolean, default: false }
});

module.exports = questionSchema;