// Random Forest

const mongoose = require('mongoose');

const propertyListingSchema = new mongoose.Schema({

    
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  
  // Basic contact information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [
      /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
      'Please add a valid email'
    ],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  preferredContactMethod: {
    type: String,
    enum: ['email', 'phone'],
    default: 'email'
  },
  
  // ID verification
  emiratesId: {
    type: String,
    trim: true
  },
  passportNumber: {
    type: String,
    trim: true
  },
  
  // Property details
  propertyType: {
    type: String,
    required: [true, 'Property type is required'],
    enum: ['apartment', 'house', 'villa', 'commercial', 'land'],
    trim: true
  },
  propertyLocation: {
    type: String,
    required: [true, 'Property location is required'],
    trim: true
  },
  bedrooms: {
    type: String,
    trim: true
  },
  bathrooms: {
    type: String,
    trim: true
  },
  propertySize: {
    type: String,
    trim: true
  },
  
  // Document details
  documentPath: {
    type: String,
    trim: true
  },
  documentName: {
    type: String,
    trim: true
  },
  filePath: {
    type: String,
    trim: true
  },
  
  // Additional information
  availabilityForVisit: {
    type: String,
    trim: true
  },
  urgency: {
    type: String,
    enum: ['urgent', 'normal', 'relaxed'],
    default: 'normal'
  },
  additionalInfo: {
    type: String,
    trim: true
  },
  
  // Status tracking
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to update the updatedAt field
propertyListingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create model validation middleware
propertyListingSchema.pre('validate', function(next) {
  // Check that either Emirates ID or Passport Number is provided
  if (!this.emiratesId && !this.passportNumber) {
    this.invalidate('identification', 'Either Emirates ID or Passport Number must be provided');
  }
  next();
});

// Virtual property for full document URL (if you have a base URL for accessing files)
propertyListingSchema.virtual('documentUrl').get(function() {
  if (!this.documentPath) return null;
  
  // Replace with your actual base URL for accessing uploaded files
  const baseUrl = process.env.BASE_URL || 'http://localhost:8000';
  return `${baseUrl}/${this.documentPath.replace(/\\/g, '/')}`;
});

// Enable virtuals in JSON
propertyListingSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

const PropertyListing = mongoose.model('PropertyListing', propertyListingSchema);

module.exports = PropertyListing;

// Random Forest