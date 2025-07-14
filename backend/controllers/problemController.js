const Problems = require('../models/problems');

const createProblem = async (req, res, next) => {
    try {
        const { title, description, inputFormat, outputFormat, difficulty } = req.body;

        if (!(title && description && inputFormat && outputFormat)) {
            return res.status(400).send('All fields are required');
        }

        const newProblem = await Problems.create({
            title,
            description,
            inputFormat,
            outputFormat,
            difficulty,
            createdBy: req.user.id //user info from token, added by middleware
        });
        res.status(200).json({ message: 'Problem created', problemId: newProblem._id });


    } catch (error) {
        next(error);
    }
};

//This API is used to fetch a list of all problems for the homepage/problem list screen
const getAllProblem = async (req, res, next) => {
    try {
        const problems = await Problems.find({});
        res.status(200).json(problems);
        if (!problems.length) {
            return res.status(404).json({ message: 'No problems found' });
        }
    } catch (error) {
        next(error);
    }
};
//When user clicks on a problem in the list, we show full details.
const getProblemById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const problem = await Problems.findById(id);
        if (!problem) return res.status(404).send('Problem not Found');
        res.status(200).send(problem)
    } catch (error) {
        next(error);
    }

};
const getMyProblems = async (req, res, next) => {
  try {
    const rows = await Problems
      .find({ createdBy: req.user.id })
      .select('title description difficulty createdAt')
      .sort({ createdAt: -1 })
      .lean();

    res.json(rows);
  } catch (err) { next(err); }
};

module.exports = { createProblem, getAllProblem, getProblemById,getMyProblems };

