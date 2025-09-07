const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config();

async function fixAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const updated = await User.findOneAndUpdate(
      { email: "admin@getitdone.com" },
      {
        $set: {
          password: hashedPassword,
          role: "admin",
          status: "Approved"
        }
      },
      { new: true }
    );

    if (updated) {
      console.log("✅ Admin account updated with hashed password!");
    } else {
      console.log("⚠️ No admin found, run create instead.");
    }

    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error updating admin:", err.message);
    mongoose.disconnect();
  }
}

fixAdmin();
