const express = require('express');
const app = express();

const {getUserProfile, updateUserProfile } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware'); 


app.get('/profile', authMiddleware,getUserProfile)
app.put('/profile',authMiddleware, updateUserProfile);

module.exports = app;