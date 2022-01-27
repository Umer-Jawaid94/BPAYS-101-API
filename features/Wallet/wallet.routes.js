const express = require('express');
const router = express.Router();
const validator = require('../../common/validator');
const verify = require('../../common/verify');


const walletHandler = require('./wallet.handler');


router.route(`/:id`).put(verify.user, walletHandler.updateWallet)
// router.route(`/:id`).delete(verify.user, userHandler.deleteUser)


module.exports = router;
