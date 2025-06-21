const express = require('express');
const app = express();
const {createSubmission, getUserSubmission, getSubmissinByID} =require('../controllers/submissionController');
const authMiddleware = require('../middleware/authMiddleware');

app.post('/create',authMiddleware,createSubmission);

app.get('/',authMiddleware,getUserSubmission);
app.get('/:id',authMiddleware,getSubmissinByID);//id we are sending is submission id

module.exports = app;