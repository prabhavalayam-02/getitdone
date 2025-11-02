// routes/users.js
const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

/**
 * @route   GET /api/users/:id
 * @desc    Get user profile by ID
 */
router.get("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Get User Error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

/**
 * @route   PATCH /api/users/:id
 * @desc    Update user profile
 */
router.patch("/:id", auth, async (req, res) => {
  try {
    const { name, phone, address, bio, skills } = req.body;
    
    const updateFields = {};
    if (name) updateFields.name = name;
    if (phone) updateFields.phone = phone;
    if (address) updateFields.address = address;
    if (bio) updateFields.bio = bio;
    if (skills) updateFields.skills = skills;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

module.exports = router;
