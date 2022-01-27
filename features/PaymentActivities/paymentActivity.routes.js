const express = require('express');
const router = express.Router();
const validator = require('../../common/validator');
const verify = require('../../common/verify');


const paymentActivityHandler = require('./paymentActivity.handler');


router.route(`/`).get(verify.user, paymentActivityHandler.getAllActivities)
// router.route(`/:id`).delete(verify.user, userHandler.deleteUser)


module.exports = router;
