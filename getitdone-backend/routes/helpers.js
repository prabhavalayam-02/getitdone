// routes/helpers.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/multer");
const cloudinary = require("../config/cloudinary");
const User = require("../models/User");

/**
 * @route   GET /api/helpers/kyc-status
 * @desc    Get current user's KYC status
 */
router.get("/kyc-status", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("helperStatus kycDocs");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      helperStatus: user.helperStatus,
      kycDocs: user.kycDocs,
      canUpdate: user.helperStatus !== "pending",
    });
  } catch (err) {
    console.error("Get KYC status failed:", err);
    res.status(500).json({ error: "Failed to get KYC status", details: err.message });
  }
});

/**
 * @route   POST /api/helpers/apply
 * @desc    Apply to become a helper by uploading KYC documents
 */
router.post("/apply", auth, upload.array("kycDocs", 3), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Prevent reapplication if status is pending
    if (user.helperStatus === "pending") {
      return res.status(403).json({ 
        error: "Your application is already pending review",
        helperStatus: user.helperStatus 
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No KYC documents uploaded" });
    }

    const uploadedDocs = [];

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
      
      uploadedDocs.push({
        type: "document",
        url: result.secure_url,
      });
    }

    // Update user with KYC docs and set status to pending
    user.kycDocs = uploadedDocs;
    user.helperStatus = "pending";
    await user.save();

    res.json({
      message: "KYC documents uploaded successfully. Your application is now pending review.",
      helperStatus: user.helperStatus,
      kycDocs: user.kycDocs,
    });
  } catch (err) {
    console.error("KYC upload failed:", err);
    res.status(500).json({ error: "KYC upload failed", details: err.message });
  }
});

/**
 * @route   PATCH /api/helpers/:id/kyc
 * @desc    Upload/Update KYC documents (for reapplication after rejection)
 */
router.patch("/:id/kyc", auth, upload.array("kycDocs", 3), async (req, res) => {
  try {
    // Check if user can update KYC
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Prevent updates if status is pending
    if (user.helperStatus === "pending") {
      return res.status(403).json({ 
        error: "Cannot update KYC while previous submission is pending approval",
        helperStatus: user.helperStatus 
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const uploadedDocs = [];

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
      
      uploadedDocs.push({
        type: "document",
        url: result.secure_url,
      });
    }

    // Replace KYC docs and set status back to pending
    user.kycDocs = uploadedDocs;
    user.helperStatus = "pending";
    await user.save();

    res.json({
      message: "KYC documents updated successfully. Your application is now pending review.",
      helperStatus: user.helperStatus,
      kycDocs: user.kycDocs,
    });
  } catch (err) {
    console.error("KYC upload failed:", err);
    res.status(500).json({ error: "KYC upload failed", details: err.message });
  }
});

module.exports = router;
