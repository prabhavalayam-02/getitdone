const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    serviceCategory: {
      type: String,
    },
    location: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
    },
    attachments: [
      {
        type: String, // store file URLs
      },
    ],
    contactInfo: {
      phone: { type: String },
      email: { type: String },
    },

    // relationships
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    acceptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // this will be a helper
    },

    // task status
    status: {
      type: String,
      enum: ["open", "pending-approval", "in-progress", "completed", "cancelled"],
      default: "open",
    },

    // log history of status changes
    history: [
      {
        status: String,
        changedAt: { type: Date, default: Date.now },
      },
    ],
    
    // Rating and review from tasker (user) to helper
    rating: { type: Number, min: 1, max: 5 },
    review: { type: String },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);

// middleware to track history
TaskSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    this.history.push({ status: this.status });
  }
  next();
});

module.exports = mongoose.model("Task", TaskSchema);
