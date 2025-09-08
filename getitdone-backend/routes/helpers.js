// routes/helpers.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/multer");
const cloudinary = require("../config/cloudinary");
const User = require("../models/User");

// Upload KYC
router.patch("/:id/kyc", auth, upload.array("kycDocs", 3), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const uploadedDocs = [];

    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "kyc_uploads",
      });
      uploadedDocs.push({
        type: "document", // you can extend later with req.body.type
        url: result.secure_url,
      });
    }

    const helper = await User.findByIdAndUpdate(
      req.params.id,
      { $push: { kycDocs: { $each: uploadedDocs } } },
      { new: true }
    );

    if (!helper) {
      return res.status(404).json({ error: "Helper not found" });
    }

    res.json({
      message: "KYC uploaded successfully",
      kycDocs: helper.kycDocs,
    });
  } catch (err) {
    console.error("KYC upload failed:", err);
    res.status(500).json({ error: "KYC upload failed", details: err.message });
  }
});

module.exports = router;
