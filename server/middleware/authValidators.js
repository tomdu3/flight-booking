
const { body, validationResult, oneOf } = require('express-validator');

// Registration data validator
const registerValidator = [
    body('username').notEmpty()
      .withMessage('Username is required')
      .trim()  // tirms the whitespaces from the beginning and end of the string
      .custom(value => !/\s/.test(value)).withMessage('Username should not contain spaces')
      .custom(value => !value.includes('@'))  
      .withMessage('Username should not contain @ symbol'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password')
      .isLength({ min: 8 }) // Increased minimum length to accommodate more complexity
      .withMessage('Password must be at least 8 characters long')
      .matches(/[a-zA-Z]/)
      .withMessage('Password must contain at least one letter')
      .matches(/[0-9]/)
      .withMessage('Password must contain at least one number')
      .matches(/[^a-zA-Z0-9\s]/) // Matches any character that is NOT a letter, number, or whitespace
      .withMessage('Password must contain at least one special character'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ];

// Login data validator
const loginValidator = [
  // Either email or username must be provided (but not necessarily both)
  oneOf([
    [
      body('email')
        .exists() // Check if field exists
        .withMessage('Email is required if username is not provided')
        .isEmail()
        .withMessage('Invalid email format')
        .trim(),
    ],
    [
      body('username')
        .exists() // Check if field exists
        .withMessage('Username is required if email is not provided')
        .notEmpty()
        .withMessage('Username cannot be empty')
        .trim(),
    ],
  ]),
  // Password is always required
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .trim(),
  // Handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];



module.exports = {
  registerValidator,
  loginValidator
};