const express  = require('express');
const app = express();
const { getLeaderboard } = require('../controllers/leaderboardController');


app.get('/leaderboard',getLeaderboard);

module.exports = app;