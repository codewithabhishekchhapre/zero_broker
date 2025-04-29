const express = require("express");
const router = express.Router();
const planController = require("../controllers/planController");
const { accessTokenVerify, authorizeRoles } = require("../middleware/authMiddleware");

// API Route: Get plans based on user role and interest
router.get("/plans",accessTokenVerify, planController.getPlansByRoleAndCategory);

module.exports = router;
