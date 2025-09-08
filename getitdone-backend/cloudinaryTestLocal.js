// cloudinaryTestLocal.js
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const path = require("path");

// ✅ Cloudinary config from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Path to your local image
const filePath = path.join(__dirname, "test.png"); // replace with your local image name

// Upload
cloudinary.uploader
  .upload(filePath, { folder: "test_uploads" })
  .then((result) => {
    console.log("✅ Local file upload successful!");
    console.log("URL:", result.secure_url);
  })
  .catch((err) => {
    console.error("❌ Upload failed:", err);
  });
