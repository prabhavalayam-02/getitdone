// routes/admin.js
const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

/**
 * @route   GET /api/admin/helpers/pending
 * @desc    Get all helpers waiting for approval (with KYC docs)
 */
router.get("/helpers/pending", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Only admins can view pending helpers" });
    }

    const helpers = await User.find({ role: "helper", helperStatus: "pending" }).select(
      "-password"
    );

    res.json(helpers);
  } catch (error) {
    console.error("Admin Pending Helpers Error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

/**
 * @route   PATCH /api/admin/helpers/:id/approve
 * @desc    Approve a helper account
 */
router.patch("/helpers/:id/approve", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Only admins can approve helpers" });
    }

    const helper = await User.findByIdAndUpdate(
      req.params.id,
      { helperStatus: "approved" },
      { new: true }
    ).select("-password");

    if (!helper) {
      return res.status(404).json({ msg: "Helper not found" });
    }

    res.json({ msg: "Helper approved successfully", helper });
  } catch (error) {
    console.error("Approve Helper Error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

/**
 * @route   PATCH /api/admin/helpers/:id/reject
 * @desc    Reject a helper account
 */
router.patch("/helpers/:id/reject", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Only admins can reject helpers" });
    }

    const helper = await User.findByIdAndUpdate(
      req.params.id,
      { helperStatus: "rejected" },
      { new: true }
    ).select("-password");

    if (!helper) {
      return res.status(404).json({ msg: "Helper not found" });
    }

    res.json({ msg: "Helper rejected successfully", helper });
  } catch (error) {
    console.error("Reject Helper Error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

module.exports = router;
