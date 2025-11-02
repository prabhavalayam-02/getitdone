const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const cloudinary = require("../config/cloudinary");
const upload = require("../middleware/multer");

const router = express.Router();

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user or helper
 */
router.post("/signup", upload.array("kycDocs", 3), async (req, res) => {
  const { name, email, password, phone, address, role } = req.body;

  try {
    // 1. Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // 2. Handle KYC uploads for helpers
    const kycDocs = [];
    if (role === "helper" && req.files && req.files.length > 0) {
      for (const file of req.files) {
        // Upload buffer to Cloudinary
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: "kyc_uploads" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(file.buffer);
        });
        
        kycDocs.push({
          type: "document",
          url: result.secure_url,
        });
      }
    }

    // 3. Create new user
    user = new User({
      name,
      email,
      password, // will be hashed in UserSchema.pre("save")
      phone,
      address,
      role,
      kycDocs,
    });

    await user.save();

    // 3. Return JWT
    const token = jwt.sign(
      { id: user._id, role: user.role, helperStatus: user.helperStatus },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        helperStatus: user.helperStatus,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & return token
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // 2. Compare password with bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // 3. Create JWT
    const token = jwt.sign(
      { id: user._id, role: user.role, helperStatus: user.helperStatus },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        helperStatus: user.helperStatus,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
