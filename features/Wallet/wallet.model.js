const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const Schema = mongoose.Schema;
const Wallet = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  credits: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('Wallet', Wallet);
