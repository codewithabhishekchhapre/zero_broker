const mongoose = require('mongoose');

const propertyListingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' // Assuming there's a User model
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  preferredContactMethod: {
    type: String,
    enum: ['phone', 'email'],
    required: true
  },
  emiratesId: {
    type: String,
    required: true
  },
  passportNumber: {
    type: String,
    default: ''
  },
  propertyType: {
    type: String,
    enum: ['apartment', 'house', 'villa', 'commercial', 'other'], // adjust as needed
    required: true
  },
  propertyLocation: {
    type: String,
    required: true
  },
  bedrooms: {
    type: Number,
    required: true
  },
  bathrooms: {
    type: Number,
    required: true
  },
  propertySize: {
    type: Number,
    required: true
  },
  documentPath: {
    type: String,
    default: null
  },
  documentName: {
    type: String,
    default: null
  },
  filePath: {
    type: String,
    default: ''
  },
  availabilityForVisit: {
    type: String,
    required: true
  },
  urgency: {
    type: String,
    enum: ['normal', 'urgent'],
    required: true
  },
  additionalInfo: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true // automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('ProperyListingByAgent', propertyListingSchema, 'propertylistings');