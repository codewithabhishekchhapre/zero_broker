const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { sendResponse } = require("../utils/responseHandler");
const { checkUserByEmail } = require("../utils/checkUserExist");
const catchAsync = require("../utils/catchAsync");

// Allowed roles that can be created
const allowedRoles = {
  admin: ["subadmin", "agent", "driver"],
  subadmin: ["agent", "driver"], // Subadmin  can manage agent and driver
  agent: ["driver"],
};


const isRoleAllowed = (creatorRole, targetRole) => {
  return allowedRoles[creatorRole]?.includes(targetRole);
};

// Create Agent or Driver (Admin creates both, Agent creates driver only)
const createUserByRole = catchAsync(async (req, res) => {
  const { fullname, email, password, mobile, profilePhoto, role } = req.body;

  if (!isRoleAllowed(req.user.role, role)) {
    return sendResponse(res, 403, "failed", "You are not allowed to create this role");
  }

  if (await checkUserByEmail(email)) {
    return sendResponse(res, 400, "failed", "Email already registered");
  }

  // const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    fullname,
    email,
    password ,
    mobile,
    role,
    profilePhoto,
  });

  return sendResponse(res, 201, "success", `${role} created successfully`, { data: newUser });
});

// Get All Agents or Drivers
const getUsersByRole = catchAsync(async (req, res) => {
  const roleToGet = req.params.role;

  if (!isRoleAllowed(req.user.role, roleToGet)) {
    return sendResponse(res, 403, "failed", "You are not allowed to view this role");
  }

  const users = await User.find({ role: roleToGet }).select("-password");
  return sendResponse(res, 200, "success", `${roleToGet}s retrieved successfully`, { data: users });
});

// Update User
const updateUserByRole = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { fullname, email, mobile, profilePhoto } = req.body;

  const user = await User.findById(userId);
  if (!user || !isRoleAllowed(req.user.role, user.role)) {
    return sendResponse(res, 403, "failed", "Not authorized to update this user");
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { fullname, email, mobile, profilePhoto },
    { new: true, runValidators: true }
  ).select("-password");

  return sendResponse(res, 200, "success", "User updated successfully", { data: updatedUser });
});

// Delete User
const deleteUserByRole = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user || !isRoleAllowed(req.user.role, user.role)) {
    return sendResponse(res, 403, "failed", "Not authorized to delete this user");
  }

  await User.findByIdAndDelete(userId);
  return sendResponse(res, 200, "success", "User deleted successfully", { data: { deleted: true } });
});

// Get Profile
const getProfile = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user || (user.role !== "agent" && user.role !== "driver")) {
    return sendResponse(res, 404, "failed", "User not found");
  }

  return sendResponse(res, 200, "success", "Profile retrieved", { data: user });
});

module.exports = {
  createUserByRole,
  getUsersByRole,
  updateUserByRole,
  deleteUserByRole,
  getProfile,
};
