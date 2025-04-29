const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true, 
    index: true  // Indexing for faster queries
  },  
  plan: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Plan", 
    required: true, 
    index: true
  },  

  // role: { type: String, enum: ["buyer", "seller", "agent"], required: true }, // User role  
  category: { type: String, enum: ["buy", "rent", "boost"], required: true }, // Plan category  
  price: { type: Number, required: true }, // Plan price  

  paymentStatus: { 
    type: String, 
    enum: ["pending", "completed", "failed"], 
    default: "pending" 
  }, // Payment status  

  transactionId: { 
    type: String, 
    unique: true, 
    sparse: true  // Ensures uniqueness but allows null values
  }, // Unique Payment Transaction ID  

  startDate: { type: Date, default: Date.now },  
  expiryDate: { 
    type: Date, 
    required: true,
    default: function () {
      return new Date(new Date().setMonth(new Date().getMonth() + 1)); // Default: 1-month expiry
    }
  },  

  status: { 
    type: String, 
    enum: ["active", "expired", "canceled", "renewed"], // Added "renewed" for better tracking
    default: "active", 
    index: true 
  },  

  autoRenew: { type: Boolean, default: false }, // Auto-renewal flag  

}, { timestamps: true });

module.exports = mongoose.model("Subscription", subscriptionSchema);
