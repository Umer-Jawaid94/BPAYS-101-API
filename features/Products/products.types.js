let Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);


exports.createProduct = Joi.object().keys({
  query: {},
  params: {},
  body: Joi.object().keys({
    name: Joi.string().required(),
    image: Joi.string().required(),
    category: Joi.objectId().required(),
    price: Joi.number().required(),
    user: Joi.string().allow('')
  })
});


exports.updateProductById = Joi.object().keys({
  query: {},
  params: { id: Joi.string().required() },
  body: Joi.object().keys({
    name: Joi.string(),
    image: Joi.string(),
    category: Joi.objectId(),
    price: Joi.number()
  }).min(1)
});

exports.deleteProduct = Joi.object().keys({
  query: { id: Joi.string().required() },
  params: {},
  body: {}
});
