const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Initialize Razorpay (optional - allows server to start without Razorpay config)
let razorpay = null;

try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log('✅ Razorpay payment gateway configured');
  } else {
    console.warn('⚠️  Razorpay credentials not configured. Payment features disabled.');
  }
} catch (error) {
  console.warn('⚠️  Failed to initialize Razorpay:', error.message);
}

/**
 * @route   POST /api/subscription/create-order
 * @desc    Create a Razorpay order for subscription
 */
router.post("/create-order", authMiddleware, async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({ msg: "Payment gateway not configured. Please contact support." });
    }

    const { plan } = req.body; // "monthly" or "yearly"

    if (req.user.role !== "helper") {
      return res.status(403).json({ msg: "Only helpers can subscribe" });
    }

    // Define subscription amounts in INR (in paise)
    const amounts = {
      monthly: 49900, // ₹499
      yearly: 499900, // ₹4999
    };

    if (!amounts[plan]) {
      return res.status(400).json({ msg: "Invalid subscription plan" });
    }

    const options = {
      amount: amounts[plan],
      currency: "INR",
      receipt: `subscription_${req.user.id}_${Date.now()}`,
      notes: {
        userId: req.user.id,
        plan: plan,
      },
    };

    const order = await razorpay.orders.create(options);
    res.json({ order });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

/**
 * @route   POST /api/subscription/verify-payment
 * @desc    Verify Razorpay payment and activate subscription
 */
router.post("/verify-payment", authMiddleware, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ msg: "Invalid payment signature" });
    }

    // Update user subscription
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const startDate = new Date();
    let endDate = new Date();
    
    if (plan === "monthly") {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (plan === "yearly") {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    user.subscription = {
      status: "active",
      plan: plan,
      startDate: startDate,
      endDate: endDate,
      paymentId: razorpay_payment_id,
      trialTasksCompleted: user.subscription.trialTasksCompleted || 0,
      trialTasksLimit: user.subscription.trialTasksLimit || 5,
    };

    await user.save();

    res.json({ 
      msg: "Subscription activated successfully", 
      subscription: user.subscription 
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

/**
 * @route   GET /api/subscription/status
 * @desc    Get subscription status for the logged-in helper
 */
router.get("/status", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ subscription: user.subscription });
  } catch (error) {
    console.error("Get subscription status error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

module.exports = router;
