
const Boom = require('boom');
const payments = require('./payments.model');

exports.createPayment = (data) => {
  try {
    return payments.create(data);
  } catch (error) {
    return Boom.badImplementation('Something went wrong')
  }
}

exports.getAllPayments = (filter = {}, skip = 0, limit = 25) => {
  try {
    return payments.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('dealer');
  } catch (error) {
    console.log(error)
    return Boom.badImplementation('Something went wrong')
  }
}
exports.getPaymentsByFilter = (filter = {}) => {
  try {
    return payments.find(filter).sort({ createdAt: -1 }).populate('dealer');
  } catch (error) {
    console.log(error)
    return Boom.badImplementation('Something went wrong')
  }
}
exports.getPaymentsCount = (filter = {}) => {
  try {
    return payments.count(filter);
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
    return payments.findOne(filter).populate('dealer');
  } catch (error) {
    return Boom.badImplementation('Something went wrong')
  }
}
