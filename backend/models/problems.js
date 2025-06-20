//Create the Problem Model
const mongoose = require('mongoose')

const problemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    inputFormat: {
        type: String,
        required: true
    },
    outputFormat: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'difficult'],
        default: 'medium'
    },
    createdBy: {//It creates a reference to another document in the User collection by storing the user's ObjectId
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });// via this Mongoose will automatically add two extra fields - createdAt, updatedAt

module.exports = mongoose.model('Problem', problemSchema);




