const auth = require('../../common/auth');
const Boom = require('boom');

const Wallet = require('./wallet.model');

exports.createWallet = (user, credits) => {
  try {
    return Wallet.create({ user, credits });
  } catch (error) {
    return Boom.badImplementation('Something went wrong')
  }
}

exports.updateWallet = (filter = {}, data) => {
  try {
    // console.log(filter, data)
    return Wallet.findOneAndUpdate(filter, data, { new: true });
  } catch (error) {
    return Boom.badImplementation('Something went wrong')
  }
}

exports.getWallet = (filter = {}) => {
  try {
    return Wallet.findOne(filter);
  } catch (error) {
    return Boom.badImplementation('Something went wrong')
  }
}


exports.deleteWallet = (filter = {}) => {
  try {
    return Wallet.findOneAndDelete(filter);
  } catch (error) {
    return Boom.badImplementation('Something went wrong')
  }
}

