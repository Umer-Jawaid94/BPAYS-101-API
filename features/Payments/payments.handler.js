
const Boom = require('boom');
const { createActivity } = require('../PaymentActivities/paymentActivity.controller');
const { getUserbyFilter } = require('../user/user.controller');

const { createWallet, updateWallet, getWallet, deleteWallet } = require('../Wallet/wallet.controller');
const { createPayment, getAllPayments, getPayment, updatePayment, getPaymentsCount, getPaymentsByFilter } = require('./payments.controller');


exports.getAllPayments = async (req, res, next) => {
  try {
    let data = {
      payments: [],
      count: 0
    }
    if (req._user.role !== 'admin' && req._user.role !== 'processor') {
      if (req.query.scope === 'full') {
        data.payments = await getPaymentsByFilter({ dealer: req._user._id, sim: req.query.sim });
      } else {
        data.payments = await getAllPayments({ dealer: req._user._id, sim: req.query.sim }, req.query.skip * 1);
        data.count = await getPaymentsCount({ dealer: req._user._id, sim: req.query.sim });
      }
    } else if (req.query.scope === 'full') {
      data.payments = await getPaymentsByFilter({ sim: req.query.sim });
    } else {
      data.payments = await getAllPayments({ sim: req.query.sim }, req.query.skip * 1);
      data.count = await getPaymentsCount({ sim: req.query.sim });
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
    if (!req.body.addOn) {
      req.body.addOn = 0
    }
    const user = await getUserbyFilter({ _id: req.body.dealer })
    const wallet = await getWallet({ user: req.body.dealer })
    let amount = wallet.amount - (req.body.amount + req.body.addOn)
    if (amount >= 0) {
      const data = await createPayment(req.body)
      await updateWallet({ _id: wallet._id }, { amount })
      await createActivity({ creator: req._user._id, user, amount: req.body.amount + req.body.addOn, type: 'payment-created', role: user.role })
      const newData = await getPayment({ _id: data._id })
      return res.json({
        data: newData
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
  if (!req.body.addOn) {
    req.body.addOn = 0
  }
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
      if (req.body.status === 'cancelled') {
        await createActivity({ creator: req._user, user, amount: req.body.amount + req.body.addOn, type: `payment-${req.body.status}`, role: user.role })
      } else {
        await createActivity({ creator: req._user, user, amount: req.body.amount + req.body.addOn, type: `payment-${req.body.status}`, role: req._user.role })
        await createActivity({ creator: req._user, user, amount: req.body.amount + req.body.addOn, type: `payment-${req.body.status}`, role: user.role })
      }
    }
    if (req.body.status === 'completed') {
      await createActivity({ creator: req._user, user, amount: req.body.amount + req.body.addOn, type: 'payment-completed', role: req._user.role })
      await createActivity({ creator: req._user, user, amount: req.body.amount + req.body.addOn, type: 'payment-completed', role: user.role })
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


