let Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);


exports.registerUser = Joi.object().keys({
  query: {},
  params: {},
  body: Joi.object().keys({
    name: Joi.string().required(),
    role: Joi.string().required(),
    phone: Joi.number().allow(0),
    password: Joi.string().required(),
    amount: Joi.number().allow(0),
    distributor: Joi.objectId().optional(),
    subDistributor: Joi.objectId().optional(),
    username: Joi.string().required(),
    discountRate: Joi.number().allow(0)
  })
});

exports.updateUser = Joi.object().keys({
  query: {},
  params: {
    id: Joi.objectId().required()
  },
  body: Joi.object().keys({
    name: Joi.string().required(),
    phone: Joi.number().allow(0),
    amount: Joi.number().allow(0),
    discountRate: Joi.number().allow(0)
  })
});
