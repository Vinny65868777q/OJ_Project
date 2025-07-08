const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        maxlength: 100,
        trim: true
    },

    description: {
        type: String,
        default: ''
    },

    problems: [

        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Problem',
            required: true
        }
    ],

    startAt: {
        type: Date,
        required: true
    },
    endAt: {
        type: Date,
        required: true
    },

    /* who created / manages the contest */
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    /* users who have registered */
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
});


module.exports = mongoose.model('Contest', contestSchema);