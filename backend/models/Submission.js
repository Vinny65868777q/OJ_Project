const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    problemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
        required: true
    },
    code: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    verdict: {
        type: String,
        enum: ['Accepted', 'Wrong Answer', 'Runtime Error', 'Time Limit Exceeded', 'Compilation Error'],
        default: 'Compilation Error'
    },
    submittedAt: {
        type: Date,
        default:Date.now

    },
    executionTime: {
    type: Number, // in milliseconds
    default: null
  }

});

module.exports = mongoose.model('Submission', submissionSchema);