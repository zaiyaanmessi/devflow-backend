const mongoose = require('mongoose');
const questionSchema = require('../schema/questionSchema');

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;