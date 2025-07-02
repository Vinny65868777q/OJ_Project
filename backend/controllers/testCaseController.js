const TestCase = require('../models/TestCase');

const createTestCase = async (req, res,next) => {
console.log('🔥 createTestCase req.body:', req.body);
    try {
        const { problemId, input, expectedOutput, isSample } = req.body;

        if (!(problemId && input && expectedOutput)) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        const newTestCase = await TestCase.create({
            problemId,
            input,
            expectedOutput,
            isSample: isSample || false,//If the frontend doesn’t send isSample, it becomes false automatically.
            createdBy: req.user.id // admin ID from auth middleware
        });

        res.status(200).json({ message:'Test Cases created'})
    } catch (error) {
        next(error);
    }
};

const getTestCaseByProblem = async (req, res, next) => {
    try {
        const { problemId } = req.params;
        const testcase = await TestCase.find({ problemId });

        if (!testcase.length) {//This ensures you're checking whether there is any data inside the array, not just whether the array exists.
            return res.status(404).send('No test cases found for this problem');
        }

        res.status(200).send(testcase);

    } catch (error) {

        next(error);

    }

};

const updateTestCase = async (req, res, next) => {
    try {
        const { id } = req.params;//this id comes from the URL itself, not from middleware.
        const updateData = req.body;//This line is taking the data you send in the body of the request and storing it in the variable updateData.

        const updatedTestCase = await TestCase.findByIdAndUpdate(id, updateData, {

            new: true,// Return updated document
            runValidators: true//validate the upadtes

        });
        if (!updatedTestCase) {
            return res.status(404).send("Test case not found");
        }
        res.status(200).send(updatedTestCase);
    }
    catch (error) {
        next(error);
    }
};

const deleteTestCase = async (req, res, next) => {
    try {
        const { id } = req.params;

        const deletedTestCase = await TestCase.findByIdAndDelete(id);

        if (!deletedTestCase) {
            return res.status(404).send('Test Case not Found');
        }

        res.status(200).send('Test Case Succesfully deleted');
    } catch (error) {
        next(error);
    }

};
module.exports = { createTestCase, getTestCaseByProblem, updateTestCase, deleteTestCase };