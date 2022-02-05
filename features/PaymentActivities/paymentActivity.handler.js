
const Boom = require('boom');

const { createWallet, updateWallet, getWallet, deleteWallet } = require('../Wallet/wallet.controller');
const { getAllUsers, getUserbyFilter, updateUser, updateUserWithWallet, deleteUser } = require('../user/user.controller');
const { createActivity, getAllActivities } = require('./paymentActivity.controller');


exports.getAllActivities = async (req, res, next) => {
  try {
    let data
    if (req._user.role !== 'admin') {
      if (req._user.role === 'distributor') {
        const subDistributors = await getAllUsers({ distributor: req._user._id })
        const sDIds = subDistributors.map(sd => sd._id)
        if (req.query.role === 'distributor') {
          data = await getAllActivities({ role: req.query.role, $or: [{ user: req._user._id }, { creator: req._user._id }] });
        } else if (req.query.role === 'subDistributor') {
          data = await getAllActivities({ role: req.query.role, $or: [{ user: sDIds }, { creator: sDIds }] })
        } else {
          const dealers = await getAllUsers({ subDistributor: sDIds })
          const dIds = dealers.map(d => d._id)
          data = await getAllActivities({ role: req.query.role, $or: [{ user: dIds }, { creator: dIds }] })
        }
      } else if (req._user.role === 'subDistributor') {
        if (req.query.role === 'subDistributor') {
          data = await getAllActivities({ role: req.query.role, $or: [{ user: req._user._id }, { creator: req._user._id }] });
        } else {
          const dealers = await getAllUsers({ subDistributor: req._user._id })
          const dIds = dealers.map(d => d._id)
          data = await getAllActivities({ role: req.query.role, $or: [{ user: dIds }, { creator: dIds }] })
        }
      } else if (req._user.role === 'dealer') {
        if (req.query.role === 'dealer') {
          data = await getAllActivities({ role: req.query.role, $or: [{ user: req._user._id }, { creator: req._user._id }] });
        }
      }
    } else {
      data = await getAllActivities({ role: req.query.role });
    }
    return res.json({
      data
    })
  } catch (error) {
    console.log(error)
    return next(Boom.badImplementation('Invalid User'))
  }
}
