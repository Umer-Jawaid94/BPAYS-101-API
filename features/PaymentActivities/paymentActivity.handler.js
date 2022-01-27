
const Boom = require('boom');

const { createWallet, updateWallet, getWallet, deleteWallet } = require('../Wallet/wallet.controller');
const { getAllUsers, getUserbyFilter, updateUser, updateUserWithWallet, deleteUser } = require('../user/user.controller');
const { createActivity, getAllActivities } = require('./paymentActivity.controller');


exports.getAllActivities = async (req, res, next) => {
  try {
    const data = await getAllActivities({ role: req.query.role });
    return res.json({
      data
    })
  } catch (error) {
    console.log(error)
    return next(Boom.badImplementation('Invalid User'))
  }
}
