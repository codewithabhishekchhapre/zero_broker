const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, sparse: true },
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    role: { type: String, enum: ["seller", "buyer","driver" ,"admin", "agent"], default: "buyer" },
    interest: {
      type: [String], // Array to allow multiple interests
      default: [], // Initially empty
    },
    // profilePhoto: { type: String },
    isGoogleUser: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    wallet: { type: mongoose.Schema.Types.ObjectId, ref: "Wallet" }, // Initially empty
  subscriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subscription" }], // No active plans
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Generate JWT Token
userSchema.methods.generateAuthToken = function () {
  const accessToken = jwt.sign(
    { id: this._id, role: this.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "10m" }
  );
  const refreshToken = jwt.sign(
    { id: this._id, role: this.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  return { accessToken, refreshToken };
};

module.exports = mongoose.model("User", userSchema);
