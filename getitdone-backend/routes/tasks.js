const express = require("express");
const Task = require("../models/Task");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");
const { sendTaskAcceptedEmail, sendTaskCompletedEmail, sendSubscriptionReminderEmail, sendHelperApprovedEmail, sendHelperRejectedEmail, sendTaskCompletedEmailToHelper } = require("../utils/emailService");

const router = express.Router();

/**
 * @route   POST /api/tasks
 * @desc    Create a new task (users and helpers can do this)
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "user" && req.user.role !== "helper") {
      return res
        .status(403)
        .json({ msg: "Only users or helpers can create tasks" });
    }

    const task = new Task({
      ...req.body,
      createdBy: req.user.id,
      status: "open", // ✅ always set to open when created
    });

    await task.save();
    
    // Populate createdBy before returning so frontend gets the full user data
    await task.populate("createdBy", "name email");
    
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

/**
 * @route   POST /api/tasks/:id/accept
 * @desc    Accept a task (only approved helpers can accept)
 */
router.post("/:id/accept", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "helper") {
      return res.status(403).json({ msg: "Only helpers can accept tasks" });
    }

    // Check helper status
    if (req.user.helperStatus !== "approved") {
      return res.status(403).json({ msg: "Your account is not approved yet" });
    }

    // Get full helper details
    const helper = await User.findById(req.user.id);
    if (!helper) {
      return res.status(404).json({ msg: "Helper not found" });
    }

    // Check subscription status
    if (helper.subscription.status === "trial") {
      if (helper.subscription.trialTasksCompleted >= helper.subscription.trialTasksLimit) {
        return res.status(403).json({ 
          msg: "Free trial limit reached. Please subscribe to continue accepting tasks.",
          requiresSubscription: true
        });
      }
    } else if (helper.subscription.status === "expired" || helper.subscription.status === "none") {
      // Check if they've never used trial
      if (helper.completedTasks === 0 && helper.subscription.trialTasksCompleted === 0) {
        // Start trial
        helper.subscription.status = "trial";
        await helper.save();
      } else {
        return res.status(403).json({ 
          msg: "Subscription required. Please subscribe to continue accepting tasks.",
          requiresSubscription: true
        });
      }
    }

    const task = await Task.findById(req.params.id).populate("createdBy", "name email phone");
    if (!task) return res.status(404).json({ msg: "Task not found" });

    if (task.status !== "open") {
      return res
        .status(400)
        .json({ msg: "Task already accepted or not available" });
    }

    task.status = "pending-approval";
    task.acceptedBy = req.user.id;
    await task.save();

    // Send email notification to tasker with approve/reject options
    try {
      await sendTaskAcceptedEmail(task, helper, task.createdBy);
    } catch (emailError) {
      console.error("Email notification failed:", emailError);
      // Don't fail the request if email fails
    }

    res.json({ msg: "Task request sent to owner. Awaiting approval.", task });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

/**
 * @route   POST /api/tasks/:id/approve-helper
 * @desc    Approve a helper for a task (only task owner can approve)
 */
router.post("/:id/approve-helper", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("createdBy", "name email phone")
      .populate("acceptedBy", "name email phone rating");
    
    if (!task) return res.status(404).json({ msg: "Task not found" });

    // Only task owner can approve
    if (task.createdBy._id.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Only task owner can approve helpers" });
    }

    if (task.status !== "pending-approval") {
      return res.status(400).json({ msg: "Task is not pending approval" });
    }

    // Approve: change status to in-progress
    task.status = "in-progress";
    await task.save();

    // Send email notification to helper
    try {
      const helper = await User.findById(task.acceptedBy._id);
      await sendHelperApprovedEmail(task, helper, task.createdBy);
    } catch (emailError) {
      console.error("Email notification failed:", emailError);
    }

    res.json({ msg: "Helper approved successfully", task });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

/**
 * @route   POST /api/tasks/:id/reject-helper
 * @desc    Reject a helper for a task (only task owner can reject)
 */
router.post("/:id/reject-helper", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("createdBy", "name email phone")
      .populate("acceptedBy", "name email phone");
    
    if (!task) return res.status(404).json({ msg: "Task not found" });

    // Only task owner can reject
    if (task.createdBy._id.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Only task owner can reject helpers" });
    }

    if (task.status !== "pending-approval") {
      return res.status(400).json({ msg: "Task is not pending approval" });
    }

    // Store helper info before removing
    const helper = task.acceptedBy;

    // Reject: change back to open and remove acceptedBy
    task.status = "open";
    task.acceptedBy = null;
    await task.save();

    // Send email notification to helper
    if (helper) {
      try {
        await sendHelperRejectedEmail(task, helper, task.createdBy);
      } catch (emailError) {
        console.error("Email notification failed:", emailError);
        // Don't fail the request if email fails
      }
    }

    res.json({ msg: "Helper rejected. Task is now available for other helpers.", task });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

/**
 * @route   POST /api/tasks/:id/complete
 * @desc    Complete a task (only the helper who accepted can complete it)
 */
router.post("/:id/complete", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "helper") {
      return res.status(403).json({ msg: "Only helpers can complete tasks" });
    }

    const task = await Task.findById(req.params.id).populate("createdBy", "name email phone");
    if (!task) return res.status(404).json({ msg: "Task not found" });

    if (task.status !== "in-progress" || task.acceptedBy.toString() !== req.user.id) {
      return res.status(400).json({ msg: "You can only complete tasks that are in-progress and assigned to you" });
    }

    task.status = "completed";
    await task.save();

    // Update helper stats
    const helper = await User.findById(req.user.id);
    if (helper) {
      helper.completedTasks += 1;
      helper.totalEarnings += task.budget;
      
      // Update trial counter if on trial
      if (helper.subscription.status === "trial") {
        helper.subscription.trialTasksCompleted += 1;
        
        // Check if trial limit reached
        if (helper.subscription.trialTasksCompleted >= helper.subscription.trialTasksLimit) {
          // Send subscription reminder email
          try {
            await sendSubscriptionReminderEmail(helper);
          } catch (emailError) {
            console.error("Subscription reminder email failed:", emailError);
          }
        }
      }
      
      await helper.save();
    }

    // Send email notifications to both tasker and helper
    try {
      await sendTaskCompletedEmail(task, helper, task.createdBy);
    } catch (emailError) {
      console.error("Email notification to tasker failed:", emailError);
    }

    try {
      await sendTaskCompletedEmailToHelper(task, helper, task.createdBy);
    } catch (emailError) {
      console.error("Email notification to helper failed:", emailError);
    }

    res.json({ msg: "Task completed successfully", task });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

/**
 * @route   GET /api/tasks/my-tasks
 * @desc    Get tasks created by the logged-in user
 */
router.get("/my-tasks", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user.id })
      .populate("createdBy", "name email")
      .populate("acceptedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

/**
 * @route   POST /api/tasks/:id/rate
 * @desc    Rate and review a completed task (only task creator can rate)
 */
router.post("/:id/rate", authMiddleware, async (req, res) => {
  try {
    const { rating, review } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ msg: "Rating must be between 1 and 5" });
    }

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: "Task not found" });

    // Only task creator can rate
    if (task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Only task creator can rate this task" });
    }

    // Task must be completed
    if (task.status !== "completed") {
      return res.status(400).json({ msg: "Can only rate completed tasks" });
    }

    // Check if already rated
    if (task.rating) {
      return res.status(400).json({ msg: "Task already rated" });
    }

    // Update task with rating and review
    task.rating = rating;
    task.review = review || "";
    task.reviewedAt = new Date();
    await task.save();

    // Update helper's overall rating
    const helper = await User.findById(task.acceptedBy);
    if (helper) {
      const totalRatings = helper.totalRatings + 1;
      const newRating = ((helper.rating * helper.totalRatings) + rating) / totalRatings;
      
      helper.rating = newRating;
      helper.totalRatings = totalRatings;
      await helper.save();
    }

    res.json({ msg: "Rating submitted successfully", task });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

/**
 * @route   POST /api/tasks/:id/rate-tasker
 * @desc    Rate and review a task owner (only helper who completed can rate)
 */
router.post("/:id/rate-tasker", authMiddleware, async (req, res) => {
  try {
    const { rating, review } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ msg: "Rating must be between 1 and 5" });
    }

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: "Task not found" });

    // Only the helper who completed the task can rate the tasker
    if (task.acceptedBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Only the helper who completed this task can rate the task owner" });
    }

    // Task must be completed
    if (task.status !== "completed") {
      return res.status(400).json({ msg: "Can only rate completed tasks" });
    }

    // Check if already rated
    if (task.taskerRating) {
      return res.status(400).json({ msg: "Task owner already rated" });
    }

    // Update task with rating and review
    task.taskerRating = rating;
    task.taskerReview = review || "";
    task.taskerReviewedAt = new Date();
    await task.save();

    // Update tasker's overall rating
    const tasker = await User.findById(task.createdBy);
    if (tasker) {
      const totalRatings = (tasker.taskerTotalRatings || 0) + 1;
      const currentRating = tasker.taskerRating || 0;
      const newRating = ((currentRating * (tasker.taskerTotalRatings || 0)) + rating) / totalRatings;
      
      tasker.taskerRating = newRating;
      tasker.taskerTotalRatings = totalRatings;
      await tasker.save();
    }

    res.json({ msg: "Rating submitted successfully", task });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks with optional filters
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { status, createdBy, acceptedBy, location } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (createdBy) filter.createdBy = createdBy;
    if (acceptedBy) filter.acceptedBy = acceptedBy;
    
    // Location-based filtering (case-insensitive partial match)
    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    const tasks = await Task.find(filter)
      .populate("createdBy", "name email")
      .populate("acceptedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

/**
 * @route   GET /api/tasks/:id
 * @desc    Get a single task by ID
 */
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("acceptedBy", "name email");

    if (!task) return res.status(404).json({ msg: "Task not found" });

    res.json(task);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task (only creator or admin can delete)
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: "Task not found" });

    if (req.user.role === "user" || req.user.role === "helper") {
      if (task.createdBy.toString() !== req.user.id) {
        return res
          .status(403)
          .json({ msg: "You can only delete your own tasks" });
      }
    }

    if (req.user.role === "admin") {
      await task.deleteOne();
      return res.json({ msg: "Task deleted by admin successfully" });
    }

    await task.deleteOne();
    res.json({ msg: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

module.exports = router;
