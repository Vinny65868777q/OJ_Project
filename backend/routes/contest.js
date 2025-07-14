const express = require('express');
const router = express.Router();
const role          = require('../middleware/roleMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const { getTodayContests, joinContest, getContestById, getLeaderboard,createContest, getContestProblem } = require('../controllers/contestController');

// GET /api/contests/next
router.get('/next',authMiddleware,getTodayContests);

// POST /api/contests/:id/join
router.post('/:id/join',authMiddleware, joinContest);

// GET /api/contests/:id
router.get('/:id', authMiddleware, getContestById);

// GET /api/contests/:id/leaderboard
router.get('/:id/leaderboard', authMiddleware,getLeaderboard);

router.get('/:cid/problems/:pid',authMiddleware,getContestProblem);

router.post(
  '/with-problems',          // POST /api/contests/with-problems
  authMiddleware,
  role('admin'),
  createContest
);

module.exports = router;