const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const payments = new Schema({
  status: {
    type: String,
    default: 'pending'
  },
  sim: {
    type: String
  },
  comment: {
    type: String
  },
  businessName: {
    type: String
  },
  plan: {
    type: String
  },
  amount: {
    type: Number
  },
  phone: {
    type: String
  },
  pin: {
    type: String
  },
  dealer: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('payments', payments);
