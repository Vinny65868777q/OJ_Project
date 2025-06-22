const { body, validationResult } = require('express-validator');

const validateLogin = [
    body('email')
        .notEmpty().withMessage('Email required')
        .isEmail().withMessage('Email must be valid'),

    body('password')
        .notEmpty().withMessage('Pawword required')
        .isLength({ min: 6 }).withMessage('Password must at least 6 characters'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send(errors.array())
        }
        next();

    }

];

module.exports = validateLogin;