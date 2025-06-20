const express = require('express');
const app = express();
const {createSubmission} =require('../controllers/submissionController');
const authMiddleware = require('../middleware/authMiddleware');

app.post('/create',authMiddleware,createSubmission);

module.exports = app;