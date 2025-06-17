const express = require('express');
const dotenv = require('dotenv');
const {DBConnection} = require('./database/db');// a shortcut to pull the DBConnection function out of that object.
const User = require("./models/User");
const authRoutes = require('./routes/authRoutes');

dotenv.config();//loads the .env file
DBConnection();//runs the function

const app = express();
app.use(express.json());//This tells the server to accept data in JSON format
app.use(express.urlencoded({extended: true}));

app.get('/',(req,res) => {
    res.send('API is running');
});

app.listen(process.env.PORT, () => {//.listen() is a method that starts the server
    console.log(`Server is listening on port ${process.env.PORT}!`);// when server is runing it will print this msg on terminal
});//it is a callback function

app.use('/api/auth',authRoutes)//actual end point becomes /api/auth/register and api/auth/login ie all the routed defined in authRoutes.js will be prefiexed with this automatically// is to make our routes organized, grouped, and meaningful.



