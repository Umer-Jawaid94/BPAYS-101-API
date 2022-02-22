const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const Schema = mongoose.Schema;
const User = new Schema({
  username: {
    type: String
  },
  password: String,
  name: {
    type: String
  },
  phone: {
    type: Number
  },
  wallet: {
    type: Schema.Types.ObjectId,
    ref: 'Wallet'
  },
  role: {
    type: String,
    enum: ['admin', 'distributor', 'subDistributor', 'dealer', 'processor']
  },
  distributor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  subDistributor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  discountRate: Number
}, {
  timestamps: true
});
User.plugin(passportLocalMongoose, {
  usernameField: 'username',
  usernameLowerCase: true
});
module.exports = mongoose.model('User', User);
