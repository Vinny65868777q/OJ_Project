const User = require('../models/User');
const { body, validationResult } = require('express-validator');


const getUserProfile = async (req, res, next) => {
    try {
        
        const userId = req.user.id;//// from auth middleware
        const user = await User.findById(userId).select('-password');// exclude password
        if (!user) {
            return res.status(404).send('User Not Found');
        }
        res.status(200).send(user);
        

    } catch (error) {
        next(error);
    }

};



const updateUserProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { firstname, lastname, email, password } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send('User Not Found');
        }

        if (firstname) user.firstname = firstname;
        if (lastname) user.lastname = lastname;
        if (email) user.email = email;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }
        await user.save();//Saves that user to the MongoDB database.

        res.status(200).send('Profile updated successfully');
    } catch (error) {
        next(error);
    }
};

module.exports = { getUserProfile, updateUserProfile};