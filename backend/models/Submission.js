const mongoose = require('mongoose');


const snapshotSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    difficulty: String
}, { _id: false });


const submissionSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    contestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contest',
        default: null
    },



    problemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
        required: true
    },

    problemSnapshot: {
        type: snapshotSchema,
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
        default: Date.now

    },
    executionTime: {
        type: Number, // in milliseconds
        default: null
    }

});

module.exports = mongoose.model('Submission', submissionSchema);