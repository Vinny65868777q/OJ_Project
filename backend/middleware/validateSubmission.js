const { body, validationResult } = require('express-validator');

const validateSubmission = [

    body('problemId')
        .notEmpty().withMessage('Problem ID is required')
        .isMongoId().withMessage('Problem ID must be a valid Mongo ID'),

    body('contestId')
        .optional({ checkFalsy: true })  // allows undefined, null, or empty
        .isMongoId().withMessage('Contest ID must be a valid Mongo ID'),
        
    body('code')
        .notEmpty().withMessage('Code is required'),

    body('language')
        .notEmpty().withMessage('Language is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }
        next();
    }

];

module.exports = validateSubmission;