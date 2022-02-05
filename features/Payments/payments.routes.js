const express = require('express');
const router = express.Router();
const validator = require('../../common/validator');
const verify = require('../../common/verify');


const paymentActivityHandler = require('./payments.handler');


router.route(`/`).get(verify.user, paymentActivityHandler.getAllPayments)
router.route(`/`).post(verify.user, paymentActivityHandler.createPayment)
router.route(`/:id`).put(verify.user, paymentActivityHandler.updatePayment)


module.exports = router;
