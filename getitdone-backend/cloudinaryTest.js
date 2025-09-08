const cloudinary = require("./config/cloudinary");

console.log("Cloudinary config:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET ? "HIDDEN" : "MISSING",
});

(async () => {
  try {
    const result = await cloudinary.uploader.upload(
      "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      { folder: "test_uploads" }
    );
    console.log("✅ Upload successful!");
    console.log(result.secure_url);
  } catch (error) {
    console.error("❌ Upload failed:", error.message);
  }
})();
