const { body } = require("express-validator");

const announcementCreateValidation = [
  body("title")
    .notEmpty()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Title is required and cannot exceed 100 characters"),
  
  body("content")
    .notEmpty()
    .trim()
    .withMessage("Content is required"),
  
  body("course")
    .notEmpty()
    .trim()
    .withMessage("Course is required"),
  
  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium, or high"),
  
  body("category")
    .optional()
    .isIn(["general", "academic", "events", "urgent"])
    .withMessage("Category must be general, academic, events, or urgent"),
  
  body("attachments")
    .optional()
    .isArray()
    .withMessage("Attachments must be an array"),
  
  body("attachments.*.filename")
    .optional()
    .trim()
    .withMessage("Attachment filename must be a string"),
  
  body("attachments.*.url")
    .optional()
    .isURL()
    .withMessage("Attachment URL must be a valid URL"),
  
  body("attachments.*.size")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Attachment size must be a positive integer"),
  
  body("attachments.*.type")
    .optional()
    .trim()
    .withMessage("Attachment type must be a string")
];

const announcementUpdateValidation = [
  body("title")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),
  
  body("content")
    .optional()
    .trim()
    .withMessage("Content must be a string"),
  
  body("course")
    .optional()
    .trim()
    .withMessage("Course must be a string"),
  
  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium, or high"),
  
  body("category")
    .optional()
    .isIn(["general", "academic", "events", "urgent"])
    .withMessage("Category must be general, academic, events, or urgent"),
  
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
  
  body("attachments")
    .optional()
    .isArray()
    .withMessage("Attachments must be an array"),
  
  body("attachments.*.filename")
    .optional()
    .trim()
    .withMessage("Attachment filename must be a string"),
  
  body("attachments.*.url")
    .optional()
    .isURL()
    .withMessage("Attachment URL must be a valid URL"),
  
  body("attachments.*.size")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Attachment size must be a positive integer"),
  
  body("attachments.*.type")
    .optional()
    .trim()
    .withMessage("Attachment type must be a string")
];

module.exports = {
  announcementCreateValidation,
  announcementUpdateValidation
};
