require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
// const morgan = require("morgan"); // optional, for logging

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");
const adminRoutes = require("./routes/admin");
const helperRoutes = require("./routes/helpers");

const app = express();

// ===== Middleware =====
app.use(express.json());
app.use(cors());
app.use(helmet());
// app.use(morgan("dev")); // optional logging

// ===== Rate limiter =====
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});
app.use(limiter);

// ===== Routes =====
app.get("/", (req, res) => {
  res.send("🚀 Backend server is running...");
});
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/helpers", helperRoutes);
// ===== Connect to MongoDB =====

const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Debug: Log MongoDB URI with credentials hidden

const mongoUri = process.env.MONGO_URI && process.env.MONGO_URI.trim();
if (!mongoUri) {
  console.error('❌ MONGO_URI is not defined in .env');
  process.exit(1);
}
if (!/^mongodb(\+srv)?:\/\//.test(mongoUri)) {
  console.error('❌ MONGO_URI is malformed. It should start with mongodb:// or mongodb+srv://');
  process.exit(1);
}
const safeUri = mongoUri.replace(/(mongodb(?:\+srv)?:\/\/)(.*:.*)@/, '$1<hidden>:<hidden>@');
console.log('Connecting to MongoDB URI:', safeUri);

mongoose
  .connect(mongoUri)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
