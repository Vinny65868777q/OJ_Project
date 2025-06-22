const express = require('express')
const router = express()
const { registerUser,loginUser } = require('../controllers/authController');
const validateRegistration = require('../middleware/validateRegistration');
const validateLogin = require('../middleware/validateLogin');

router.post('/register',validateRegistration,registerUser);
router.post('/login',validateLogin,loginUser);

module.exports=router;
