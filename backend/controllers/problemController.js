const Problems = require('../models/problems');

const createProblem = async (req, res) => {
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
        res.status(201).send(newProblem);

    } catch (error) {
        res.status(500).send('Error creating Problem');
        console.error("Create problem error:", error);
    }
};

//This API is used to fetch a list of all problems for the homepage/problem list screen
const getAllProblem = async (req, res) => {
    try {
        const problems = await Problems.find({});
        res.status(200).send(problems);
    } catch (error) {
        console.log('Error fetching problem', error);
        res.status(500).send('Server error while fetching problems');
    }
};
//When user clicks on a problem in the list, we show full details.
const getProblemById = async (req, res) => {
    try {
        const { id } = req.params;
        const problem = await Problems.findById(id);
        if (!problem) return res.status(404).send('Problem not Found');
        res.status(200).send(problem)
    } catch (error) {
        console.log('Error fetching problem', error);
        res.status(500).send('Server error while fetching problem');
    }

};
//update controller API
const updateProblem = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const upadatedProblem = await Problems.findByIdAndUpdate(id, updateData, {
            new: true,  // return the updated document
            runValidators: true //schema validations (like required: true, or enum values like "easy", "medium", "hard") are still checked even during update.
        });

        if (!upadatedProblem) {
            return res.status(404).send('Problem not Found');
        }
        res.status(200).send(upadatedProblem);
    } catch (error) {
        console.error("Error updating problem:", error);
        res.status(500).send("Server error while updating problem");
    }
};

const deleteProblem = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedproblem = await Problems.findByIdAndDelete(id);
        if (!deletedproblem) {
            return res.status(404).send('Problem not Found');
        }
        res.status(200).send("Problem deleted successfully");

    } catch (error) {
      console.log("Error deleting problem:", error);
      res.status(500).send('Server error while deleting problem');
    }

};

module.exports = { createProblem, getAllProblem, getProblemById, updateProblem,deleteProblem};

