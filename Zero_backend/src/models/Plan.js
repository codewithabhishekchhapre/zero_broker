const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Plan name (Basic, Intermediate, etc.)
  role: { type: String, enum: ["buyer", "seller"], required: true }, // Buyer or Seller
  category: { 
    type: String, 
    enum: ["buy", "rent", "boost"], // 'buy' for property buyers, 'rent' for tenants, 'boost' for seller promotions
    required: true 
  }, 
  price: { type: Number, required: true }, // Price in AED
  contacts: { type: Number, required: true }, // Contact credits for buyers/tenants
  features: [String], // List of plan features
});

module.exports = mongoose.model("Plan", planSchema);
