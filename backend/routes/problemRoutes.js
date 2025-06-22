const express = require('express');
const app = express();
const { createProblem, getAllProblem, getProblemById, updateProblem, deleteProblem } = require('../controllers/problemController');
const roleMiddleware = require('../middleware/roleMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const validateProblem = require('../middleware/validateProblem');

app.post('/create', authMiddleware, roleMiddleware('admin'),validateProblem, createProblem);

app.get('/', getAllProblem)
app.get('/:id', getProblemById)

app.put('/:id', authMiddleware, roleMiddleware('admin'),validateProblem,updateProblem);// Update problem (admin only)
app.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteProblem); //Delete problem(admin only)

module.exports = app;