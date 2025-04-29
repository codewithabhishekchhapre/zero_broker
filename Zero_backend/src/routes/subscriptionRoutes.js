const express = require("express");
const { getActiveSubscriptions, cancelSubscription, verifyPayment } = require("../controllers/subscriptionController");
const { accessTokenVerify } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Create Subscription (Buy Plan)

// ✅ Get Active Subscriptions
router.get("/active", accessTokenVerify, getActiveSubscriptions);

// ✅ Cancel Subscription
router.post("/cancel", accessTokenVerify, cancelSubscription);

// ✅ Verify Payment
router.post("/verify-payment", accessTokenVerify, verifyPayment);

module.exports = router;
