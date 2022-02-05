const Boom = require("boom");
const Users = require("./user.model");

exports.getAllUsers = (filter = {}) => {
  try {
    // console.log(filter)
    return Users.find({ ...filter, isDeleted: false }).populate('wallet distributor subDistributor');
  } catch (error) {
    console.log('error======', error)
    // return Boom.badImplementation('no user found')
  }
}

exports.getUserbyFilter = (filter = {}) => {
  try {
    return Users.findOne({ ...filter, isDeleted: false }).populate('wallet distributor subDistributor');
  } catch (error) {
    return Boom.badImplementation('no user found')
  }
}

exports.updateUser = (filter = {}, data) => {
  try {
    // console.log(filter, data)
    return Users.findOneAndUpdate(filter, data, { new: true }).populate('wallet distributor subDistributor');
  } catch (error) {
    console.log(error)
    return Boom.badImplementation('no user found')
  }
}

exports.updateUserWithWallet = (filter = {}, data, walletId) => {
  try {
    // console.log(filter, data)
    Users.findOneAndUpdate(filter, data).populate('wallet');
  } catch (error) {
    return Boom.badImplementation('no user found')
  }
}

exports.deleteUser = (filter = {}) => {
  try {
    return Users.findOneAndUpdate(filter, { isDeleted: true });
  } catch (error) {
    return Boom.badImplementation('no user found')
  }
}