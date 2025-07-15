const express = require('express');
const app = express();
const {createSubmission, getUserSubmission, getSubmissionByID} =require('../controllers/submissionController');
const authMiddleware = require('../middleware/authMiddleware');
const validateSubmission = require('../middleware/validateSubmission');

app.post('/create',authMiddleware,validateSubmission,createSubmission);

app.get('/',authMiddleware,getUserSubmission);
app.get('/:id',authMiddleware,getSubmissionByID);//id we are sending is submission id

module.exports = app;