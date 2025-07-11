const express  = require('express');
const app = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const dashboard = require('../controllers/dashboardController');

app.get('/stats', authMiddleware,  dashboard.getStats );
app.get('/skills', authMiddleware, dashboard.getSkills);
app.get('/recommended-problems', authMiddleware, dashboard.getRecommendedProblems);
app.get('/submission',authMiddleware,dashboard.getSubmission);

module.exports = app;


