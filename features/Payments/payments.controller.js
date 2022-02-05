
const Boom = require('boom');
const payments = require('./payments.model');

exports.createPayment = (data) => {
  try {
    return payments.create(data);
  } catch (error) {
    return Boom.badImplementation('Something went wrong')
  }
}

exports.getAllPayments = (filter = {}) => {
  try {
    return payments.find(filter).populate('dealer');
  } catch (error) {
    return Boom.badImplementation('Something went wrong')
  }
}

exports.updatePayment = (filter = {}, data = {}) => {
  try {
    return payments.findOneAndUpdate(filter, data, { new: true }).populate('dealer');
  } catch (error) {
    return Boom.badImplementation('Something went wrong')
  }
}


exports.getPayment = (filter = {}) => {
  try {
    return payments.findOne(filter);
  } catch (error) {
    return Boom.badImplementation('Something went wrong')
  }
}
