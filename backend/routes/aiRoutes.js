const express = require('express');
const router= express.Router();
const {simplify, hint} = require('../controllers/aiController');

router.post('/simplify',simplify);

router.post('/hint',hint);

module.exports = router;

