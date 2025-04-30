const mongoose = require('mongoose');

const locationDetailsSchema = new mongoose.Schema({
  country: { type: String, default: '' },
  emirate: { type: String, default: '' },
  city: { type: String, required: true },
  landmark: { type: String, default: '' },
  address: { type: String, required: true },
  latitude: { type: String, default: '' },
  longitude: { type: String, default: '' },
  neighborhood: { type: String, default: '' },
  street: { type: String, default: '' },
  building_name: { type: String, default: '' },
  apartment_number: { type: String, default: '' },
  floor_number: { type: String, default: '' }
});

const assignDriverSchema = new mongoose.Schema({
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Driver'
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Property' // Adjust as needed
  },
  agentId: {
    type: mongoose.Schema.Types.ObjectId,   //const agentId = req.user.id;
    required: false,
    ref: 'Agent' // Adjust as needed
  },
  locationDetails: {
    type: locationDetailsSchema,
    required: true
  },
  visitingDate: {
    type: Date,
    required: true
  },
  visitingTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'completed', 'cancelled'], // Expand as needed
    default: 'pending'
  },
  assignedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('AssignDriver', assignDriverSchema);
