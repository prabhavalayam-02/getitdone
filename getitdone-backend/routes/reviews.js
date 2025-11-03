const express = require("express");
const Task = require("../models/Task");
const User = require("../models/User");

const router = express.Router();

/**
 * @route   GET /api/reviews/helper/:helperId
 * @desc    Get all reviews for a specific helper
 */
router.get("/helper/:helperId", async (req, res) => {
  try {
    const helperId = req.params.helperId;
    
    // Get helper info
    const helper = await User.findById(helperId).select("name email rating totalRatings completedTasks");
    
    if (!helper) {
      return res.status(404).json({ msg: "Helper not found" });
    }
    
    // Get all completed tasks where this helper was involved
    const tasks = await Task.find({
      acceptedBy: helperId,
      status: "completed",
      rating: { $exists: true, $ne: null }
    })
      .populate("createdBy", "name")
      .select("title rating review createdAt createdBy")
      .sort({ createdAt: -1 });
    
    // Format reviews
    const reviews = tasks.map(task => ({
      _id: task._id,
      taskId: task._id,
      taskTitle: task.title,
      rating: task.rating,
      review: task.review || "",
      reviewerName: task.createdBy?.name || "Anonymous",
      createdAt: task.createdAt
    }));
    
    res.json({
      name: helper.name,
      email: helper.email,
      rating: helper.rating || 0,
      totalRatings: helper.totalRatings || 0,
      completedTasks: helper.completedTasks || 0,
      reviews
    });
  } catch (error) {
    console.error("Get helper reviews error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

/**
 * @route   GET /api/reviews/tasker/:taskerId
 * @desc    Get all reviews for a specific tasker
 */
router.get("/tasker/:taskerId", async (req, res) => {
  try {
    const taskerId = req.params.taskerId;
    
    // Get tasker info
    const tasker = await User.findById(taskerId).select("name email taskerRating taskerTotalRatings");
    
    if (!tasker) {
      return res.status(404).json({ msg: "Tasker not found" });
    }
    
    // Get all completed tasks created by this tasker that have tasker ratings
    const tasks = await Task.find({
      createdBy: taskerId,
      status: "completed",
      taskerRating: { $exists: true, $ne: null }
    })
      .populate("acceptedBy", "name")
      .select("title taskerRating taskerReview createdAt acceptedBy")
      .sort({ createdAt: -1 });
    
    // Format reviews
    const reviews = tasks.map(task => ({
      _id: task._id,
      taskId: task._id,
      taskTitle: task.title,
      rating: task.taskerRating,
      review: task.taskerReview || "",
      reviewerName: task.acceptedBy?.name || "Anonymous",
      createdAt: task.createdAt
    }));
    
    res.json({
      name: tasker.name,
      email: tasker.email,
      rating: tasker.taskerRating || 0,
      totalRatings: tasker.taskerTotalRatings || 0,
      reviews
    });
  } catch (error) {
    console.error("Get tasker reviews error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

module.exports = router;
