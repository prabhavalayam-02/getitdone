const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String },

    role: {
      type: String,
      enum: ["user", "helper", "admin"],
      default: "user",
    },

    // Helper-specific fields
    helperStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: null,
    },
    kycDocs: [
      {
        type: { type: String },
        url: { type: String },
      },
    ],
    bio: { type: String },
    skills: [{ type: String }],
    
    // Helper stats
    completedTasks: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    
    // Tasker stats (when user creates tasks and gets rated by helpers)
    taskerRating: { type: Number, default: 0 },
    taskerTotalRatings: { type: Number, default: 0 },
    
    // Subscription fields for helpers
    subscription: {
      status: {
        type: String,
        enum: ["none", "trial", "active", "expired"],
        default: "none"
      },
      trialTasksCompleted: { type: Number, default: 0 },
      trialTasksLimit: { type: Number, default: 5 },
      plan: { type: String }, // e.g., "monthly", "yearly"
      startDate: { type: Date },
      endDate: { type: Date },
      paymentId: { type: String }
    },
  },
  { timestamps: true }
);

// hash password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// password compare
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
