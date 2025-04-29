const mongoose = require("mongoose");

const FilterSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    filterName: { type: String, required: true }, // NEW: Custom filter name
    city: { type: String },
    emirate: { type: String },
    bedrooms: { type: Number },
    bathrooms: { type: Number },
    purpose: { type: String },
    minPrice: { type: Number },
    maxPrice: { type: Number },
    created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Filter", FilterSchema);
