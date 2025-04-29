const express = require("express");
const { handleStripeWebhook } = require("../controllers/stripeWebhook");

const router = express.Router();

// Stripe Webhook Route
router.post("/stripe-webhook", express.raw({ type: "application/json" }), handleStripeWebhook);

module.exports = router;
