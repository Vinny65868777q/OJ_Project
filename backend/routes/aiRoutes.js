const express = require('express');
const router= express.Router();
const {simplify, hint} = require('../controllers/aiController');
const auth           = require('../middleware/authMiddleware');
const aiRateLimiter  = require('../middleware/aiRateLimiter');

router.post('/simplify',
  auth,            // must be logged-in
  aiRateLimiter,   // ⬅️ counts 2 / 24 h per user
  simplify);

router.post('/hint', auth,aiRateLimiter,hint);

module.exports = router;

