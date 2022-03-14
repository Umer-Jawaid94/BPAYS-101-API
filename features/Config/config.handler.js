const Boom = require("boom")
const { getConfigs, updateConfigs, createConfigs } = require("./config.controller")

exports.getConfigs = async (req, res, next) => {
  try {
    let data
    data = await getConfigs()
    if (!data) {
      data = await createConfigs()
    }
    return res.json({
      data
    })
  } catch (error) {
    return next(Boom.badImplementation(error))
  }
}

exports.updateConfigs = async (req, res, next) => {
  try {
    const data = await updateConfigs({ ...req.body })
    return res.json({
      data
    })
  } catch (error) {
    return next(Boom.badImplementation(error))
  }
}