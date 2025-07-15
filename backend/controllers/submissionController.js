const Submission = require('../models/Submission');
const Problem = require('../models/problems');
const Contest = require('../models/Contest');


const createSubmission = async (req, res, next) => {

    try {
        const { problemId, contestId = null, code, language, verdict, executionTime } = req.body;
        const userId = req.user.id  // From auth middleware

        let snap;
        if (contestId) {
            const contest = await Contest.findById(contestId).lean();
            if (!contest) return res.status(404).json({ error: 'Contest not found' });
            const embedded = contest.problems.find(p => p._id.toString() === problemId);
            if (!embedded) return res.status(400).json({ error: 'Problem not in contest' });
            snap = {
                _id: embedded._id,
                title: embedded.title,
                difficulty: embedded.difficulty
            };
        } else {
            const global = await Problem.findById(problemId).lean();
            if (!global) return res.status(404).json({ error: 'Problem not found' });
            snap = {
                _id: global._id,
                title: global.title,
                difficulty: global.difficulty
            };
        }


        const submission = await Submission.create({
            userId,
            
            problemId,
            contestId,
            problemSnapshot: snap,
            code,
            language,
            verdict,
            executionTime
        });

        res.status(201).json(submission);
    } catch (error) {
        next(error);
    }

};
//Returns all submissions by the logged-in user — basically their submission history or list.
// controllers/submissionController.js
const getUserSubmission = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // 1) Fetch submissions, populating the old problemId for fallback
        const subs = await Submission.find({ userId })
            .sort({ submittedAt: -1 })
            .populate('problemId', 'title difficulty')  // keep this
            .lean();

        // 2) Map into the shape your frontend expects, with a safe fallback
        const payload = subs.map(s => ({
            _id: s._id,
            title: s.problemSnapshot?.title      // use the new snapshot…
                ?? s.problemId?.title       // …or fall back to the populated global title
                ?? 'Unknown Problem',       // final fallback
            difficulty: s.problemSnapshot?.difficulty // same idea if you need it
                ?? s.problemId?.difficulty
                ?? 'medium',
            language: s.language,
            verdict: s.verdict,
            executionTime: s.executionTime,
            submittedAt: s.submittedAt

        }));

        res.status(200).json(payload);
    } catch (error) {
        next(error);
    }
};


//Returns one specific submission by its unique ID — used when you want to see details of a particular submission (like code, verdict, timestamps).

const getSubmissionByID = async (req, res, next) => {
    try {
        const { id } = req.params;
        const submission = await Submission.findById(id)
            .populate('problemId', 'title difficulty')
            .lean()

        if (!submission) {
            return res.status(404).send('Submission not Found');
        }
        // Ensure only the user who made the submission can view it
        if (submission.userId.toString() !== req.user.id) {
            return res.status(403).send("Unauthorized");
        }

        const title = submission.problemSnapshot?.title     // contest snapshot
            || submission.problemId?.title         // global
            || 'Unknown Problem';
        const difficulty = submission.problemSnapshot?.difficulty
            || submission.problemId?.difficulty
            || 'medium';
        return res.json({
            _id: submission._id,
            title,
            difficulty,
            language: submission.language,
            verdict: submission.verdict,
            executionTime: submission.executionTime,
            submittedAt: submission.submittedAt,
            code: submission.code,
            contestId: submission.contestId || null
        });
    }catch (error) {
        next(error);
    }

};

module.exports = { createSubmission, getUserSubmission, getSubmissionByID };