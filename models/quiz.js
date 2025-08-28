const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, "Question is required"],
    trim: true,
  },
  options: {
    type: [String],
    required: [true, "Options are required"],
    validate: {
      validator: function (options) {
        return options.length >= 2; // At least 2 options required
      },
      message: "At least 2 options are required",
    },
  },
  correctAnswer: {
    type: String,
    required: [true, "Correct answer is required"],
    validate: {
      validator: function (answer) {
        return this.options.includes(answer);
      },
      message: "Correct answer must be one of the provided options",
    },
  },
  points: {
    type: Number,
    default: 1,
    min: [1, "Points must be at least 1"],
  },
});

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    course: {
      type: String,
      required: [true, "Course is required"],
      trim: true,
    },
    topic: {
      type: String,
      required: [true, "Topic is required"],
      trim: true,
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
      validate: {
        validator: function (date) {
          return date > new Date();
        },
        message: "Due date must be in the future",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to calculate total points
quizSchema.pre("save", function (next) {
  if (this.questions && this.questions.length > 0) {
    this.totalPoints = this.questions.reduce(
      (total, question) => total + question.points,
      0
    );
  }
  next();
});

// Virtual for checking if quiz is expired
quizSchema.virtual("isExpired").get(function () {
  return new Date() > this.dueDate;
});

// Virtual for checking if quiz is available
quizSchema.virtual("isAvailable").get(function () {
  const now = new Date();
  return this.isActive && now <= this.dueDate;
});

// Index for better query performance
quizSchema.index({ course: 1, isActive: 1, dueDate: 1 });
quizSchema.index({ createdBy: 1 });

module.exports = mongoose.model("Quiz", quizSchema);
