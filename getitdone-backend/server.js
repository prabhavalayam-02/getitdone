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
const userRoutes = require("./routes/users");

const app = express();

// ===== Middleware =====
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===== CORS Configuration =====
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || 'http://localhost:5173'
    : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8080', 'http://127.0.0.1:5173', 'http://127.0.0.1:8080'],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// ===== Security =====
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));
// app.use(morgan("dev")); // optional logging

// ===== Rate limiter =====
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

// ===== Routes =====
app.get("/", (req, res) => {
  res.send("🚀 Backend server is running...");
});
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/helpers", helperRoutes);
app.use("/api/users", userRoutes);

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
  .connect(mongoUri, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Handle MongoDB connection errors after initial connection
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected');
});

// ===== Global Error Handler =====
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      msg: 'Validation Error', 
      errors: Object.values(err.errors).map(e => e.message) 
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({ msg: 'Invalid ID format' });
  }
  
  if (err.code === 11000) {
    return res.status(400).json({ msg: 'Duplicate entry. This resource already exists.' });
  }
  
  res.status(err.status || 500).json({ 
    msg: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ===== 404 Handler =====
app.use((req, res) => {
  res.status(404).json({ msg: 'Route not found' });
});

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});
