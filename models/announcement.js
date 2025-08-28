const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"]
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true
    },
    course: {
      type: String,
      required: [true, "Course is required"],
      trim: true
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },
    category: {
      type: String,
      enum: ["general", "academic", "events", "urgent"],
      default: "general"
    },
    isActive: {
      type: Boolean,
      default: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    readBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    attachments: [{
      filename: String,
      url: String,
      size: Number,
      type: String
    }]
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for author name (populated)
announcementSchema.virtual("authorName").get(function() {
  return this.author ? `${this.author.fname} ${this.author.lname}` : "Unknown";
});

// Virtual for read count
announcementSchema.virtual("readCount").get(function() {
  return this.readBy ? this.readBy.length : 0;
});

// Method to mark as read by a user
announcementSchema.methods.markAsRead = function(userId) {
  if (!this.readBy.includes(userId)) {
    this.readBy.push(userId);
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to check if user has read
announcementSchema.methods.hasRead = function(userId) {
  return this.readBy.includes(userId);
};

// Index for better query performance
announcementSchema.index({ course: 1, isActive: 1, createdAt: -1 });
announcementSchema.index({ author: 1 });
announcementSchema.index({ priority: 1, category: 1 });

module.exports = mongoose.model("Announcement", announcementSchema);
