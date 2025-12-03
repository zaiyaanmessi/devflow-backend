const mongoose = require('mongoose');
const answerSchema = require('../schema/answerSchema');

const Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;