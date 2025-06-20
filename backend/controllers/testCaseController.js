const TestCase = require('../models/TestCase');

const createTestCase = async (req, res) => {

    try {
        const { problemId, input, expectedOutput, isSample } = req.body;

        if (!(problemId && input && expectedOutput)) {
            return res.status(400).return('All required fields must be provided');
        }

        const newTestCase = await TestCase.create({
            problemId,
            input,
            expectedOutput,
            isSample: isSample || false,//If the frontend doesn’t send isSample, it becomes false automatically.
            createdBy: req.user.id // admin ID from auth middleware
        });

        res.status(201).send(newTestCase);
    } catch (error) {
        console.error("Error creating test case:", error);
        res.status(500).send("Server error while creating test case");
    }
};

const getTestCaseByProblem = async (req, res) => {
    try {
        const { problemId } = req.params;
        const testcase = await TestCase.find({ problemId });

        if (!testcase.length) {//This ensures you're checking whether there is any data inside the array, not just whether the array exists.
            return res.status(404).send('No test cases found for this problem');
        }

        res.status(200).send(testcase);

    } catch (error) {

        console.error("Error fetching test cases:", error);
        res.status(500).send("Server error while fetching test cases");

    }

};

const updateTestCase = async (req, res) => {
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
        console.error("Error updating test case:", error);
        res.status(500).send("Server error while updating test case");

    }
};

const deleteTestCase = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedTestCase = await TestCase.findByIdAndDelete(id);

        if (!deletedTestCase) {
            return res.status(404).send('Test Case not Found');
        }

        res.status(200).send('Test Case Succesfully deleted');
    } catch (error) {
        console.error("Error deleting test case:", error);
        res.status(500).send("Server error while deleting test case" );
    }

};
module.exports = { createTestCase, getTestCaseByProblem, updateTestCase, deleteTestCase };