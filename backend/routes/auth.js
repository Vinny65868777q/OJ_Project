const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.get('/check-admin', authMiddleware, (req, res) => {
  if (req.user.role === 'admin') {
    return res.json({ isAdmin: true });
  } else {
    return res.json({ isAdmin: false });
  }
});

module.exports = router;
