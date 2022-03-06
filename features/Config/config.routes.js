const express = require('express');
const router = express.Router();
const validator = require('../../common/validator');
const verify = require('../../common/verify');


const configHandler = require('./config.handler');


router.route(`/`).get(verify.user, configHandler.getConfigs)
router.route(`/`).put(verify.user, configHandler.updateConfigs)


module.exports = router;
