const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const configs = new Schema({
  simpleStatus: {
    type: Boolean,
    default: true
  },
  boostStatus: {
    type: Boolean,
    default: true
  },
  processorAvailablity: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('configs', configs);
