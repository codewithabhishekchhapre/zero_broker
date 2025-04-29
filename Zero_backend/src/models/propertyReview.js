const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const propertyReviewSchema = new Schema({
  property_id: {
    type: Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  buyer_id: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  mssg: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  }
}, { timestamps: true });

const PropertyReview = mongoose.model('PropertyReview', propertyReviewSchema);

module.exports = PropertyReview;
