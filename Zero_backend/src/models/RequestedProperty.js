const mongoose = require("mongoose");

const requestedPropertySchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Common fields
    propertyType: { type: String, required: true }, // e.g., "Apartment", "Villa"
    mode: {
      type: String,
      enum: ["self", "agent"],
      default: "self",
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Listed", "Rejected"],
      default: "Pending",
    },

    // Random Forest
    additionalInfo: { type: String },

    // Fields for "self" mode
    propertyName: { type: String },
    purpose: { type: String, enum: ["Sale", "Rent"] },
    area: { type: Number },
    address: { type: String },
    location: { type: String },
    reasonForSaleOrRent: { type: String },

    // Fields for "agent" mode
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    preferredContactMethod: { type: String },
    bedrooms: { type: Number },
    bathrooms: { type: Number },
    propertySize: { type: Number },
    propertyLocation: { type: String },
    filePath: { type: String },
    availabilityForVisit: { type: String },
    urgency: { type: String },
    emiratesId: { type: String },
    passportNumber: { type: String },
    documentPath: { type: String },
    documentName: { type: String },

    // Shared optional fields
    documents: [{ type: String }],
    // Random Forest
    assignedAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    acceptedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RequestedProperty", requestedPropertySchema);
