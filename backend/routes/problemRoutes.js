const express = require('express');
const app = express.Router();
const { createProblem, getAllProblem, getProblemById,getMyProblems } = require('../controllers/problemController');
const roleMiddleware = require('../middleware/roleMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const validateProblem = require('../middleware/validateProblem');

app.post('/create', authMiddleware, roleMiddleware('admin'),validateProblem, createProblem);

app.get('/', getAllProblem)


app.get('/allmyproblem', authMiddleware, roleMiddleware('admin'), getMyProblems);
app.get('/:id', getProblemById) //dynamic paths should always come last

module.exports = app;