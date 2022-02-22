const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Wallet = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  amount: {
    type: Number,
    default: 0
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('Wallet', Wallet);
