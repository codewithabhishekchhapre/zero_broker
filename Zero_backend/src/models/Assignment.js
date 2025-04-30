const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const assignmentSchema = new Schema({
  propertyId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Property', 
    required: true,
    index: true // Add index for faster queries
  },
  agentId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: false,
    index: true // Add index for faster queries
  },
  driverId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true // Add index for faster queries
  },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'declined', 'media_uploaded', 'approved', 'rejected'],
    default: 'pending',
    index: true // Add index for faster queries
  },
  locationDetails: {
    country: { type: String, default: '' },
    emirate: { type: String, default: '' },
    city: { type: String, default: '' },
    landmark: { type: String, default: '' },
    address: { type: String, default: '' },
    latitude: { type: String, default: '' },
    longitude: { type: String, default: '' },
    neighborhood: { type: String, default: '' },
    street: { type: String, default: '' },
    building_name: { type: String, default: '' },
    apartment_number: { type: String, default: '' },
    floor_number: { type: String, default: '' }
  },
  visitingDate: { type: Date, index: true }, // Add index for date-based queries
  visitingTime: { type: String },
  agentFeedback: { type: String },
  // Use timestamps option instead of manual createdAt/updatedAt
}, { 
  timestamps: true, // Automatically manages createdAt and updatedAt
  // Add this to make string comparisons of ObjectIds work better
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      // Convert ObjectIds to strings in JSON output
      if (ret._id) ret._id = ret._id.toString();
      if (ret.driverId) ret.driverId = ret.driverId.toString();
      if (ret.agentId) ret.agentId = ret.agentId.toString();
      if (ret.propertyId) ret.propertyId = ret.propertyId.toString();
      return ret;
    }
  }
});

// Add a pre-save hook to ensure updatedAt is set
assignmentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Add a method to safely compare driver IDs
assignmentSchema.methods.isAssignedToDriver = function(driverId) {
  if (!driverId) return false;
  
  const assignmentDriverId = this.driverId ? this.driverId.toString() : null;
  const compareDriverId = driverId instanceof mongoose.Types.ObjectId 
    ? driverId.toString() 
    : driverId;
    
  return assignmentDriverId === compareDriverId;
};

// Add a static method to find by driver ID safely
assignmentSchema.statics.findByDriverId = function(driverId) {
  if (!driverId) return this.find({ driverId: null });
  
  // Convert to ObjectId if it's a string
  let driverObjectId;
  try {
    driverObjectId = driverId instanceof mongoose.Types.ObjectId 
      ? driverId 
      : new mongoose.Types.ObjectId(driverId);
  } catch (err) {
    console.error('Invalid driver ID format:', err);
    return this.find({ _id: null }); // Return empty query
  }
  
  return this.find({ driverId: driverObjectId });
};

module.exports = mongoose.model('Assignment', assignmentSchema, 'assigndrivers');