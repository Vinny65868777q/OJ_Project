const { body, validationResult } = require('express-validator');

const validateProblem = [
    body('title')
        .notEmpty().withMessage('Title of the problem is required')
        .isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),

    body('difficulty')
        .notEmpty().withMessage('Difficulty is required')
        .isIn(['Easy', 'Medium', 'Hard']).withMessage('Difficulty must be Easy, Medium, or Hard'),

    body('description')
        .notEmpty().withMessage('Description of the problem is required')
        .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),

    body('inputFormat')
        .notEmpty().withMessage('Input format is required'),

    body('outputFormat')
        .notEmpty().withMessage('Output format is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send(errors.array());
        }
    
    next();
    }
];

module.exports = validateProblem;