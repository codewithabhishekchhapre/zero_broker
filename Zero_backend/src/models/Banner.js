const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },
  image_url: {
    type: [String],
    required: true
  },
  redirect_url: {
    type: String,
    required: true
  },
  property_type: {
    type: String,
    enum: ['Buy', 'Rent', 'Commercial', 'Residential'],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

bannerSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
  });

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;
