const auth = require('../../common/auth');
const Boom = require('boom');

const Wallet = require('./wallet.model');

exports.createWallet = (user, amount) => {
  try {
    return Wallet.create({ user, amount });
  } catch (error) {
    return Boom.badImplementation('Something went wrong')
  }
}

exports.updateWallet = (filter = {}, data) => {
  try {
    // console.log(filter, data)
    return Wallet.findOneAndUpdate(filter, data, { new: true });
  } catch (error) {
    return Boom.badImplementation(error)
  }
}

exports.getWallet = (filter = {}) => {
  try {
    return Wallet.findOne({ ...filter, isDeleted: false });
  } catch (error) {
    return Boom.badImplementation('Something went wrong')
  }
}


exports.deleteWallet = (filter = {}) => {
  try {
    return Wallet.findOneAndUpdate(filter, { isDeleted: true });
  } catch (error) {
    return Boom.badImplementation('Something went wrong')
  }
}

