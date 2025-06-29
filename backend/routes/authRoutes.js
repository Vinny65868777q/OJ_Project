const express = require('express')
const router = express()
const { registerUser,loginUser } = require('../controllers/authController');
const validateRegistration = require('../middleware/validateRegistration');
const validateLogin = require('../middleware/validateLogin');
const verifyToken = require("../middleware/authMiddleware");

router.get("/verify", verifyToken, (req, res) => {
  res.status(200).json({ message: "Token valid", user: req.user });
});
router.post('/logout', (req, res) => {
  res.clearCookie('token');  // Clears the cookie on server side
  return res.status(200).json({ message: 'Logged out successfully' });
});
router.post('/register',validateRegistration,registerUser);
router.post('/login',validateLogin,loginUser);

module.exports=router;
