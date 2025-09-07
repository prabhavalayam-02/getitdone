const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

/**
 * @route   GET /api/admin/helpers
 * @desc    Get all helpers (filter by status if query provided)
 * @access  Admin
 * @example /api/admin/helpers?status=pending
 */
router.get("/helpers", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied" });
    }

    const { status } = req.query;
    let filter = { role: "helper" };

    if (status) {
      filter.helperStatus = status.toLowerCase(); // ✅ normalize
    }

    const helpers = await User.find(filter);
    res.json(helpers);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

/**
 * @route   PATCH /api/admin/approve/:id
 * @desc    Approve a helper
 * @access  Admin
 */
router.patch("/approve/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied" });
    }

    const helper = await User.findById(req.params.id);
    if (!helper) return res.status(404).json({ msg: "Helper not found" });

    if (helper.role !== "helper") {
      return res.status(400).json({ msg: "User is not a helper" });
    }

    helper.helperStatus = "approved";
    await helper.save();

    res.json({ msg: "Helper approved successfully", helper });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

/**
 * @route   PATCH /api/admin/reject/:id
 * @desc    Reject a helper
 * @access  Admin
 */
router.patch("/reject/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied" });
    }

    const helper = await User.findById(req.params.id);
    if (!helper) return res.status(404).json({ msg: "Helper not found" });

    if (helper.role !== "helper") {
      return res.status(400).json({ msg: "User is not a helper" });
    }

    helper.helperStatus = "rejected";
    await helper.save();

    res.json({ msg: "Helper rejected successfully", helper });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

/**
 * @route   PATCH /api/admin/helpers/:id/approve
 * @desc    Approve a helper
 * @access  Admin only
 */
router.patch("/helpers/:id/approve", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Only admins can approve helpers" });
    }

    const helper = await User.findByIdAndUpdate(
      req.params.id,
      { helperStatus: "approved" },
      { new: true }
    );

    if (!helper) return res.status(404).json({ msg: "Helper not found" });

    res.json({ msg: "Helper approved successfully", helper });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});


module.exports = router;
