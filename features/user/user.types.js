let Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);


exports.registerUser = Joi.object().keys({
  query: {},
  params: {},
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required(),
    role: Joi.string().required(),
    phone: Joi.string().allow(''),
    password: Joi.string().required(),
    credits: Joi.number().allow(0),
    distributor: Joi.objectId().optional(),
    subDistributor: Joi.objectId().optional(),
  })
});

exports.updateUser = Joi.object().keys({
  query: {},
  params: {
    id: Joi.objectId().required()
  },
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().allow(''),
    credits: Joi.number().allow(0)
  })
});
