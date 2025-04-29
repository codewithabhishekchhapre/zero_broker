const User = require("../models/User");

const checkUserByEmail = async (email) => {
  return await User.findOne({ email });
};

module.exports = { checkUserByEmail };
