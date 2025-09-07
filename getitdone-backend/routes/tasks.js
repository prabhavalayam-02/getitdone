const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/auth");

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

    // ✅ check helperStatus (not status)
    if (req.user.helperStatus !== "approved") {
      return res.status(403).json({ msg: "Your account is not approved yet" });
    }

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: "Task not found" });

    // ✅ check correct open state
    if (task.status !== "open") {
      return res
        .status(400)
        .json({ msg: "Task already accepted or not available" });
    }

    task.status = "accepted";
    task.acceptedBy = req.user.id; // store helper ID
    await task.save();

    res.json({ msg: "Task accepted successfully", task });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

/**
 * @route   POST /api/tasks/:id/start
 * @desc    Start a task (only the helper who accepted can start it)
 */
router.post("/:id/start", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "helper") {
      return res.status(403).json({ msg: "Only helpers can start tasks" });
    }

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: "Task not found" });

    if (task.status !== "accepted" || task.acceptedBy.toString() !== req.user.id) {
      return res.status(400).json({ msg: "You cannot start this task" });
    }

    task.status = "in-progress";
    await task.save();

    res.json({ msg: "Task started successfully", task });
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

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: "Task not found" });

    if (task.status !== "in-progress" || task.acceptedBy.toString() !== req.user.id) {
      return res.status(400).json({ msg: "You cannot complete this task" });
    }

    task.status = "completed";
    await task.save();

    res.json({ msg: "Task completed successfully", task });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
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
