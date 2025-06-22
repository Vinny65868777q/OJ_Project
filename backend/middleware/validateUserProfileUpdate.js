const { body, validationResult } = require('express-validator');

const validateUserProfileUpdate = [
  body('firstname').optional().isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
  body('lastname').optional().isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
  body('email').optional().isEmail().withMessage('Email must be valid'),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = validateUserProfileUpdate;
