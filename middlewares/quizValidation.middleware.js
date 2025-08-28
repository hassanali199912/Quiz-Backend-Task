const { body } = require("express-validator");

const quizCreateValidation = [
  body("title")
    .notEmpty()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Title is required and cannot exceed 100 characters"),
  
  body("course")
    .notEmpty()
    .trim()
    .withMessage("Course is required"),
  
  body("topic")
    .notEmpty()
    .trim()
    .withMessage("Topic is required"),
  
  body("instructions")
    .optional()
    .trim()
    .withMessage("Instructions must be a string"),
  
  body("questions.*.question")
    .notEmpty()
    .trim()
    .withMessage("Question text is required"),
  
  body("questions.*.options")
    .isArray({ min: 2 })
    .withMessage("Each question must have at least 2 options"),
  
  body("questions.*.options.*")
    .notEmpty()
    .trim()
    .withMessage("Option text cannot be empty"),
  
  body("questions.*.correctAnswer")
    .notEmpty()
    .trim()
    .withMessage("Correct answer is required"),
  
  body("questions.*.points")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Points must be a positive integer")
];

const quizUpdateValidation = [
  body("title")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),
  
  body("course")
    .optional()
    .trim()
    .withMessage("Course must be a string"),
  
  body("topic")
    .optional()
    .trim()
    .withMessage("Topic must be a string"),
  
  body("dueDate")
    .optional()
    .isISO8601()
    .custom((value) => {
      const dueDate = new Date(value);
      const now = new Date();
      if (dueDate <= now) {
        throw new Error("Due date must be in the future");
      }
      return true;
    })
    .withMessage("Due date must be a valid future date"),
  
  body("instructions")
    .optional()
    .trim()
    .withMessage("Instructions must be a string"),
  
  body("questions")
    .optional()
    .isArray({ min: 1 })
    .withMessage("At least one question is required"),
  
  body("questions.*.question")
    .optional()
    .trim()
    .withMessage("Question text must be a string"),
  
  body("questions.*.options")
    .optional()
    .isArray({ min: 2 })
    .withMessage("Each question must have at least 2 options"),
  
  body("questions.*.options.*")
    .optional()
    .trim()
    .withMessage("Option text must be a string"),
  
  body("questions.*.correctAnswer")
    .optional()
    .trim()
    .withMessage("Correct answer must be a string"),
  
  body("questions.*.points")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Points must be a positive integer")
];

module.exports = {
  quizCreateValidation,
  quizUpdateValidation
};
