const express = require("express");
const router = express.Router();
const { accessTokenVerify } = require("../middleware/authMiddleware");
const {
  createUserByRole,
  getUsersByRole,
  updateUserByRole,
  deleteUserByRole,
  getProfile,
} = require("../controllers/agentController");
const {
  validateSignup,
} = require("../middleware/useValidations");

// Create user by role (admin can create agent/driver, agent can create driver)
router.post("/create",validateSignup, accessTokenVerify, createUserByRole);

// Get users by role (admin gets agents/drivers, agent gets drivers)
router.get("/role/:role", accessTokenVerify, getUsersByRole);

// Update user (admin/agent based on permission)
router.put("/update/:userId", accessTokenVerify, updateUserByRole);

// Delete user (admin/agent based on permission)
router.delete("/delete/:userId", accessTokenVerify, deleteUserByRole);
 
// Get logged-in agent or driver profile
router.get("/profile", accessTokenVerify, getProfile);

module.exports = router;





