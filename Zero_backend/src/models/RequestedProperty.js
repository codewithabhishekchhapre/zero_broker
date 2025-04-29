const mongoose = require("mongoose");

const requestedPropertySchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the seller
      required: true,
      index: true, // Faster queries
    },

    propertyName: { type: String, required: true },
    propertyType: { type: String, required: true },
    purpose: { type: String, enum: ["Sale", "Rent"], required: true },
    area: { type: String, required: true },
    address: { type: String, required: true },
    location: { type: String, required: true },

    reasonForSaleOrRent: { type: String }, // Optional field

    status: {
      type: String,
      enum: ["Pending", "Accepted","Listed"],
      default: "Pending",
    },

    assignedAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to assigned agent
      default: null,
      index: true,
    },
    acceptedAt: { type: Date, default: null }, // Date when request was accepted

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RequestedProperty", requestedPropertySchema);
