const { body, validationResult } = require('express-validator');

const updateUserValidator = [
  body('username').optional()
    .trim()
    .custom(value => !/\s/.test(value)).withMessage('Username should not contain spaces')
    .custom(value => !value.includes('@')).withMessage('Username should not contain @ symbol'),
  body('email').optional().isEmail().withMessage('Invalid email format'),
  body('currentPassword').optional().notEmpty().withMessage('Current password is required when changing password'),
  body('newPassword').optional()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[a-zA-Z]/)
    .withMessage('Password must contain at least one letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
    .matches(/[^a-zA-Z0-9\s]/)
    .withMessage('Password must contain at least one special character'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { updateUserValidator };