const mongoose = require('mongoose');
const voteSchema = require('../schema/voteSchema');

const Vote = mongoose.model('Vote', voteSchema);

module.exports = Vote;