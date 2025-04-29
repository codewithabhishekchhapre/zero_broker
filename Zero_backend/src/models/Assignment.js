const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const assignmentSchema = new Schema({
  propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
  agentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  driverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'declined', 'media_uploaded', 'approved', 'rejected'],
    default: 'pending'
  },
  driverResponseAt: { type: Date },
  media: [{
    url: { type: String, required: true },
    type: { type: String, enum: ['image', 'video'], required: true },
    uploadedAt: { type: Date, default: Date.now }
  }],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required:false
    },
    coordinates: {
      type: [Number],  // [longitude, latitude]
      required: false, 
      validate: {
        validator: function(v) {
          return v.length === 2 && 
                 v[0] >= -180 && v[0] <= 180 && 
                 v[1] >= -90 && v[1] <= 90;
        },
        message: props => `${props.value} is not a valid longitude/latitude coordinate`
      }
    }
  },
  agentFeedback: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create geospatial index for location
assignmentSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Assignment', assignmentSchema);