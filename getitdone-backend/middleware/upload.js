const multer = require("multer");
const path = require("path");

// Store files locally first
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  },
});

const upload = multer({ storage });

module.exports = upload;
