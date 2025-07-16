const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
const dotenv = require('dotenv');
const { DBConnection } = require('./database/db');// a shortcut to pull the DBConnection function out of that object.
const User = require("./models/User");
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const roleMiddleware = require('./middleware/roleMiddleware');
const problemRoutes = require('./routes/problemRoutes');
const testcaseRoutes = require('./routes/testCaseRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const userRoutes = require('./routes/UserRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');
const dashboardRoutes = require('./routes/dashboard');
const contestRoutes = require('./routes/contest');

dotenv.config();//loads the .env file
DBConnection();//runs the function

const app = express();

app.use(cors({
   origin: [
    "https://judgex.space",
    "https://www.judgex.space"
  ],
  credentials: true,
  exposedHeaders: [
    'RateLimit-Limit',
    'RateLimit-Remaining',
    'RateLimit-Reset',
    'Retry-After'
  ]

}));


app.use(express.json());//This tells the server to accept data in JSON format
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/api/auth', authRoutes)//actual end point becomes /api/auth/register and api/auth/login ie all the routed defined in authRoutes.js will be prefiexed with this automatically// is to make our routes organized, grouped, and meaningful.
app.use('/api/problem', problemRoutes);
app.use('/api/testcase', testcaseRoutes);
app.use('/api/submission', submissionRoutes);
app.use('/api/user', userRoutes);
app.use('/api', leaderboardRoutes);
app.use(errorHandler);
app.use('/api/auth', require('./routes/auth'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/contests', contestRoutes);


app.get('/test-protected', authMiddleware, (req, res) => {
  res.send(`Hello ${req.user.firstname}, you're logged in!`);
});//this was just to test test middleware

app.get('/admin-only', authMiddleware, roleMiddleware('admin'), (req, res) => {//authMiddleware must come first, because it checks the token and fills user info into req.user.
  //Then roleMiddleware uses that info to check the role.
  res.send(`Hello Admin ${req.user.firstname}`);
});//this was just to test middleware

app.get('/', (req, res) => {
  res.send('API is running');
});

app.listen(process.env.PORT, () => {//.listen() is a method that starts the server
  console.log(`Server is listening on port ${process.env.PORT}!`);// when server is runing it will print this msg on terminal
});//it is a callback function


