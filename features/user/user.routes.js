const express = require('express');
const router = express.Router();
const validator = require('../../common/validator');
const verify = require('../../common/verify');
const userTypes = require('./user.types')

const userHandler = require('./user.handler');

router.route(`/`).get(verify.user, userHandler.getAllUsers)
router.route(`/verify`).get(verify.user, userHandler.verifyUser)

router.route(`/register`).post(verify.user, validator(userTypes.registerUser), userHandler.register)
router.route(`/register/admin`).post(validator(userTypes.registerUser), userHandler.registerByAdmin)
router.route(`/:id`).put(validator(userTypes.updateUser), userHandler.updateUser)
router.route(`/:id`).delete(verify.user, userHandler.deleteUser)

router.route(`/login`).post(userHandler.login)

module.exports = router;
