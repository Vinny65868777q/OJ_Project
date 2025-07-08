const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const { getNextContest, joinContest, getContestById, getLeaderboard } = require('../controllers/contestController');

// GET /api/contests/next
router.get('/next',authMiddleware,getNextContest);

// POST /api/contests/:id/join
router.post('/:id/join',authMiddleware, joinContest);

// GET /api/contests/:id
router.get('/:id', authMiddleware, getContestById);

// GET /api/contests/:id/leaderboard
router.get('/:id/leaderboard', authMiddleware,getLeaderboard);

module.exports = router;