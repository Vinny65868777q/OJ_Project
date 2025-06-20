const Submission = require('../models/Submission');


const createSubmission = async (req, res) => {
    try {
        const { problemId, code, language } = req.body;
        const userId = req.user.id  // From auth middleware

        if (!(problemId && code && language)) {
            return res.status(400).send("All fields are required");
        }

        // TODO: Run code against test cases and generate verdict here
        // For now, just save submission with default verdict

        const submission = await Submission.create({
            userId,
            problemId,
            code,
            language,
            verdict: 'Compilation Error'
        });

        res.status(201).send(submission);
    } catch (error) {
        console.error("Error creating submission:", error);
        res.status(500).send("Server error while creating submission");
    }

};


module.exports = { createSubmission };