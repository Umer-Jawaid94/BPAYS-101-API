const express = require('express');
// default user route Import
const userRoutes = require('../features/user/user.routes');
const walletRoutes = require('../features/Wallet/wallet.routes');
const activitiesRouts = require('../features/PaymentActivities/paymentActivity.routes');
const paymentRoutes = require('../features/Payments/payments.routes');

module.exports = function (app) {
  const router = express.Router();
  router.use('/users', userRoutes)
  router.use('/wallets', walletRoutes)
  router.use('/activities', activitiesRouts)
  router.use('/payments', paymentRoutes)
  app.get(`/health`, function (req, res) {
    // TOD Ping DB
    res.json({
      message: 'Health Check Complete',
      success: true
    });
  });
  app.use(`/api`, router);
};

