const mongoose = require('mongoose');


const testCaseSchema = new mongoose.Schema({
    problemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',// problem model name in problem.js
        required: true
    },
    input: {
        type: String,
        required: true
    },
    expectedOutput: {
        type: String,
        required: true
    },
    isSample: {//identify whether a test case is visible to the user or not. ie is it a sample/hidden test case
        type: Boolean,
        default: false//This is a hidden test case used during evaluation
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('TestCase',testCaseSchema);