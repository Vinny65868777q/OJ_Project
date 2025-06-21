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
//Returns all submissions by the logged-in user — basically their submission history or list.
const getUserSubmission = async (req, res) => {
    try {

        const userId = req.user.id;
        const submission = await Submission.find({ userId })//query the MongoDB database.
            .populate('problemId', 'title difficulty')//replaces the problemId field (which is usually just an ObjectId) with the the title and difficulty fields.//Mongoose will also include the problem id
            .sort({ submittedAt: -1 });//the most recent submissions appear first.

        res.status(200).send(submission);

    } catch (error) {
        console.error("Error fetching user submissions:", error);
        res.status(500).send("Server error while fetching submissions");


    }

};

//Returns one specific submission by its unique ID — used when you want to see details of a particular submission (like code, verdict, timestamps).

const getSubmissinByID = async (req, res) => {
    try {
        const { id } = req.params;
        const submission = await Submission.findById(id)
            .populate('problemId', 'title difficulty')
            .populate('userId', 'firstname lastname');

        if (!submission) {
            return res.status(404).send('Submission not Found');
        }
        res.status(200).send(submission);

    } catch {
        console.error("Error fetching submission:", error);
        res.status(500).send( "Server error while fetching submission" );

    }


};

module.exports = { createSubmission, getUserSubmission,getSubmissinByID };