const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    serviceCategory: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
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
      phone: { type: String, required: true },
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
      enum: ["open", "accepted", "in-progress", "completed", "cancelled"],
      default: "open",
    },

    // log history of status changes
    history: [
      {
        status: String,
        changedAt: { type: Date, default: Date.now },
      },
    ],
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
