const express = require("express");
const router = express.Router();
const { createCheckoutSession } = require("../controllers/paymentController");
const { accessTokenVerify, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/create-checkout-session",accessTokenVerify, createCheckoutSession);

module.exports = router;
