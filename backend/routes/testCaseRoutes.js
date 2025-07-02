const express = require('express');
const app = express.Router();
const {createtestCase, createTestCase, getTestCaseByProblem,updateTestCase,deleteTestCase} = require('../controllers/testCaseController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');


app.post('/create',authMiddleware,roleMiddleware('admin'),createTestCase);//authMiddleware runs before the createProblem function.
//It attaches the user info to req.user so inside your createProblem handler, you can access:req.user.id

app.get('/problem/:problemId',getTestCaseByProblem);

app.put('/:id', authMiddleware, roleMiddleware('admin'), updateTestCase);

app.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteTestCase);

module.exports = app;

