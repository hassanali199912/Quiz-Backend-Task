const { body } = require("express-validator");

const userLoginValidation = [
  body("email").notEmpty().isEmail().trim().withMessage("Email is required"),
  body("password")
    .notEmpty()
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

const userCreateValidation = [
  body("fname").notEmpty().trim().withMessage("First Name is required"),
  body("lname").notEmpty().trim().withMessage("Last Name is required"),
  body("email").notEmpty().isEmail().trim().withMessage("Email is required"),
  body("password")
    .notEmpty()
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

const userUpdateValidation = [
  body("fname").notEmpty().trim().withMessage("First Name is required"),
  body("lname").notEmpty().trim().withMessage("Last Name is required"),
];

module.exports = {
  userLoginValidation,
  userCreateValidation,
  userUpdateValidation,
};
