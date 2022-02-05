
const Boom = require('boom');

const { createWallet, updateWallet, getWallet, deleteWallet } = require('../Wallet/wallet.controller');
const { getAllUsers, getUserbyFilter, updateUser, updateUserWithWallet, deleteUser } = require('../user/user.controller');
const { createActivity } = require('../PaymentActivities/paymentActivity.controller');


exports.updateWallet = async (req, res, next) => {
  console.log(req._user)
  try {
    const user = await getUserbyFilter({ _id: req.params.id })
    if (user) {
      const userWallet = await getWallet({ _id: user.wallet })
      let distributorWallet
      if (user.role === 'dealer') {
        distributorWallet = await getWallet({ user: user.subDistributor })
      } else {
        distributorWallet = await getWallet({ user: user.distributor })
      }
      const updatedWallet = await updateWallet({ _id: userWallet._id }, { amount: userWallet.amount + req.body.amount })
      // console.log(distributorWallet)
      await updateWallet({ _id: distributorWallet._id }, { amount: distributorWallet.amount - req.body.amount })
      if (req._user.role === 'admin') {
        if (req.body.amount < 0) {
          await createActivity({ creator: req._user, user, amount: req.body.amount, type: 'deducted', role: user.role })
        } else {
          await createActivity({ creator: req._user, user, amount: req.body.amount, type: 'added', role: user.role })
        }
      } else {
        if (req.body.amount < 0) {
          await createActivity({ creator: req._user, user, amount: req.body.amount, type: 'deducted', role: req._user.role })
          await createActivity({ creator: req._user, user, amount: req.body.amount, type: 'deducted', role: user.role })
        } else {
          await createActivity({ creator: req._user, user, amount: req.body.amount, type: 'added', role: req._user.role })
          await createActivity({ creator: req._user, user, amount: req.body.amount, type: 'received', role: user.role })
        }
      }
      user.wallet = updatedWallet
      return res.json({
        data: user
      })
    }
  } catch (error) {
    console.log(error)
    return next(Boom.badImplementation('Invalid User'))
  }
}



