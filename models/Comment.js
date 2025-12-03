const mongoose = require('mongoose');
const commentSchema = require('../schema/commentSchema');

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;