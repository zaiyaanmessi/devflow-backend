const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetType: { type: String, enum: ['question', 'answer'], required: true },
  targetId: mongoose.Schema.Types.ObjectId,
  value: { type: Number, enum: [1, -1], required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = voteSchema;