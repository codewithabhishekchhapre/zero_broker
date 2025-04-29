const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image_url: {
    type: [String],
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  valid_from: {
    type: Date,
    required: true,
  },
  valid_to: {
    type: Date,
    required: true,
  },
  property_type: {
    type: String,
    enum: ['Buy', 'Rent', 'Commercial', 'Residential'],
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Expired'],
    default: 'Active',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

offerSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
  });

module.exports = mongoose.model('Offer', offerSchema);
