const Plan = require("../models/Plan");

exports.getPlansByRoleAndCategory = async (req, res) => {
  try {
    const { role } = req.user; // Extract user role from token
    // Fetch plans based on role and category
    const plans = await Plan.find({ role });

    res.status(200).json({ success: true, plans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
