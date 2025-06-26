//register page is for new user
//It collects new user data (like name, email, password).
//It stores that data in the database after validation

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res, next) => {
    try {
        const { firstname, lastname, email, password, role } = req.body;

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            const error = new Error("User already exists with the same email");
            error.statusCode = 400;
            return next(error);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        //create new user
        const newuser = await User.create({
            firstname,
            lastname,
            email,
            password: hashedPassword,

        });

        return res.status(201).json({ msg: `Welcome ${newuser.firstname}! You are registered ` });

    } catch (error) {
        next(error);
    }
};



//This page is for existing users.
//It checks: “Does this email and password match any saved account?”
//If yes, it logs you in (starts a session or gives you a token).

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        //Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);//Takes the plain text password the user entered Hashes it internally Then checks if the hash matches user.password from the database

        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid email or password" });
        }
        const token = jwt.sign({//You fetch these details from the DB after checking that email & password match.You don’t have to look up the DB every time for these basic details
            //You can later check the role, or see which user is making a request
            id: user._id,
            firstname: user.firstname,
            email: user.email,
            role: user.role
        }, process.env.SECRET_KEY,
            { expiresIn: "1d" }//expiresIn: '1d' means the token is valid for only 1 day – after that, the user has to log in again.
        );
        user.token = token;
        user.password = undefined;
        res.status(200).json({
            message: "Login successful",
            token: token
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Error while logging in" });
    };
};

module.exports = { registerUser, loginUser };