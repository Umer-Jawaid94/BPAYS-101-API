const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const paymentActivities = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  credits: Number,
  type: String,
  role: {
    type: String
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('paymentActivities', paymentActivities);
