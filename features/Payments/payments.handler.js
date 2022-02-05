
const Boom = require('boom');
const { createActivity } = require('../PaymentActivities/paymentActivity.controller');
const { getUserbyFilter } = require('../user/user.controller');

const { createWallet, updateWallet, getWallet, deleteWallet } = require('../Wallet/wallet.controller');
const { createPayment, getAllPayments, getPayment, updatePayment } = require('./payments.controller');


exports.getAllPayments = async (req, res, next) => {
  try {
    let data
    if (req._user.role !== 'admin' && req._user.role !== 'processor') {
      data = await getAllPayments({ dealer: req._user._id });
    } else {
      data = await getAllPayments();
    }
    return res.json({
      data
    })
  } catch (error) {
    console.log(error)
    return next(Boom.badImplementation('Invalid User'))
  }
}

exports.createPayment = async (req, res, next) => {
  try {
    const user = await getUserbyFilter({ _id: req.body.dealer })
    const wallet = await getWallet({ user: req.body.dealer })
    const amount = wallet.amount - req.body.amount
    if (amount >= 0) {
      const data = await createPayment(req.body)
      await updateWallet({ _id: wallet._id }, { amount: wallet.amount - req.body.amount })
      await createActivity({ creator: req._user._id, user, amount: req.body.amount, type: 'payment-created', role: user.role })
      return res.json({
        data
      })
    } else {
      return next(Boom.forbidden('Insufficient Balance'))
    }

  } catch (error) {
    console.log(error)
    return next(Boom.badImplementation('Invalid User'))
  }
}

exports.updatePayment = async (req, res, next) => {
  try {
    const prevPayment = await getPayment({ _id: req.params.id })
    const wallet = await getWallet({ user: req.body.dealer })
    const user = await getUserbyFilter({ _id: req.body.dealer })

    const difference = prevPayment.amount - req.body.amount;

    if (difference !== 0) {
      await updateWallet({ _id: wallet._id }, { amount: wallet.amount + difference })
    }
    if (req.body.status === 'rejected' || req.body.status === 'cancelled') {
      await updateWallet({ _id: wallet._id }, { amount: wallet.amount + req.body.amount })
      await createActivity({ creator: req._user, user, amount: req.body.amount, type: `payment-${req.body.status}`, role: req._user.role })
      await createActivity({ creator: req._user, user, amount: req.body.amount, type: `payment-${req.body.status}`, role: user.role })
    }
    if (req.body.status === 'completed') {
      await createActivity({ creator: req._user, user, amount: req.body.amount, type: 'payment-completed', role: req._user.role })
      await createActivity({ creator: req._user, user, amount: req.body.amount, type: 'payment-completed', role: user.role })
    }
    const data = await updatePayment({ _id: prevPayment._id }, { ...req.body })
    return res.json({
      data
    })
  } catch (error) {
    console.log(error)
    return next(Boom.badImplementation('Invalid User'))
  }
}


