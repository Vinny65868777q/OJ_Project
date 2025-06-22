const express = require('express');
const app = express();

const {getUserProfile, updateUserProfile} = require('../controllers/userController');
const validateUserProfileUpdate = require('../middleware/validateUserProfileUpdate');
const authMiddleware = require('../middleware/authMiddleware'); 


app.get('/profile', authMiddleware,getUserProfile)
app.put('/profile',authMiddleware,validateUserProfileUpdate, updateUserProfile);

module.exports = app;