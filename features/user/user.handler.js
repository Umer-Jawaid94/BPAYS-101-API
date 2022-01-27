const auth = require('../../common/auth');
const Boom = require('boom');
const passport = require('passport');
const User = require('./user.model');
const { createWallet, updateWallet, getWallet, deleteWallet } = require('../Wallet/wallet.controller');
const { getAllUsers, getUserbyFilter, updateUser, updateUserWithWallet, deleteUser } = require('./user.controller');


exports.register = (req, res, next) => {
  User.register(new User({
    email: req.body.email.toLowerCase(),
    name: req.body.name.toLowerCase(),
    phone: req.body.phone,
    role: req.body.role,
    distributor: req.body.distributor,
    subDistributor: req.body.subDistributor
  }), req.body.password, async (err, user) => {
    if (err) {
      console.log('error', err)
      if (err.name === 'UserExistsError') {
        return next(Boom.badRequest('already exists'));
      }
      return next(Boom.badImplementation('internal server error'));
    }
    auth.getLoginData(user, null)
      .then(async () => {
        if (user.role !== 'admin') {
          if (user.role === 'subDistributor') {
            const dWallet = await getWallet({ user: req.body.distributor })
            if (dWallet) {
              await updateWallet({ _id: dWallet._id }, { credits: dWallet.credits - req.body.credits })
              const wallet = await createWallet(user._id, req.body.credits)
              let newUser = await updateUser({ _id: user._id }, { wallet: wallet._id })
              return res.json({
                message: 'success register',
                success: true,
                data: newUser
              });
            }
          }
          if (user.role === 'dealer') {
            // console.log('ok')
            const dWallet = await getWallet({ user: req.body.subDistributor })

            // console.log(dWallet)
            if (dWallet) {
              await updateWallet({ _id: dWallet._id }, { credits: dWallet.credits - req.body.credits })
              const wallet = await createWallet(user._id, req.body.credits)
              let newUser = await updateUser({ _id: user._id }, { wallet: wallet._id })
              return res.json({
                message: 'success register',
                success: true,
                data: newUser
              });
            }
          }
          const wallet = await createWallet(user._id, req.body.credits)
          let newUser = await updateUser({ _id: user._id }, { wallet: wallet._id })

          return res.json({
            message: 'success register',
            success: true,
            data: newUser
          });
        }
        return res.json({
          message: 'success register',
          success: true,
          data: user
        });
      })
      .catch(err => {
        return next(Boom.badImplementation('error', err));
      });
  });
}

exports.login = (req, res, next) => {
  passport.authenticate(`local`, (err, user, info) => {
    if (err) {
      return next(Boom.badImplementation(err));
    }
    if (info) {
      if (info.name === 'IncorrectUsernameError') {
        return next(Boom.unauthorized('incorrect username'));
      } else if (info.name === 'IncorrectPasswordError') {
        return next(Boom.unauthorized('incorrect password'));
      } else {
        return next(Boom.unauthorized(info.message));
      }
    }
    if (!user) {
      return next(Boom.badImplementation('no user'));
    }
    req.logIn(user, async err => {
      if (err) {
        return next(Boom.badImplementation('cant login'));
      }
      auth.getLoginData(user, null)
        .then(data => {
          return res.json({
            message: 'success login',
            success: true,
            data: data
          });
        })
        .catch(() => {
          return next(Boom.badImplementation('error login'));
        });
    });
  })(req, res, next);
}

exports.getAllUsers = async (req, res, next) => {
  try {
    // console.log(req._user)
    if (req._user.role === 'distributor') {
      const data = await getAllUsers({ role: req.query.role, distributor: req._user._id });
      return res.json({
        data
      })
    }
    const data = await getAllUsers({ role: req.query.role });
    return res.json({
      data
    })
  } catch (error) {
    console.log(error)
    return next(Boom.badImplementation('no user found'))
  }
}

exports.verifyUser = async (req, res, next) => {
  try {
    const _user = {
      _doc: {
        ...req._user
      }
    }
    const verify = await auth.getLoginData(_user);

    if (verify) {
      const user = await getUserbyFilter({ _id: verify.data._id })
      return res.json({
        data: user
      })
    }
  } catch (error) {
    return next(Boom.badImplementation('Invalid User'))
  }
}

exports.updateUser = async (req, res, next) => {
  try {
    const data = { ...req.body }
    if (req.body.credits) {
      delete data.credits
      await updateWallet({ user: req.params.id }, { credits: req.body.credits })
      let user = await updateUser({ _id: req.params.id }, data)
      return res.json({
        data: user
      })
    } else {
      let user = await updateUser({ _id: req.params.id }, data)
      return res.json({
        data: user
      })
    }

  } catch (error) {
    console.log(error)
    return next(Boom.badImplementation('Invalid User'))
  }
}

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await getUserbyFilter({ _id: req.params.id })
    if (user) {
      if (user.role === 'dealer') {
        const userWallet = await getWallet({ _id: user.wallet })
        const distributorWallet = await getWallet({ user: user.subDistributor })
        await updateWallet({ user: user.subDistributor }, { credits: distributorWallet.credits + userWallet.credits })
      }
      if (user.role === 'subDistributor') {
        await deleteSubDistributor(user)
      }
      if (user.role === 'distributor') {
        const subUsers = await getAllUsers({ distributor: user._id })
        let $promises = [];
        for (let i = 0; i < subUsers.length; i++) {
          $promises.push(deleteSubDistributor(subUsers[i]))
          $promises.push(deleteUser({ _id: subUsers[i]._id }))
        }
        await Promise.all($promises)
      }
      await deleteWallet({ _id: user.wallet._id })
      await deleteUser({ _id: req.params.id })
      return res.json({
        data: null
      })
    }
  } catch (error) {
    console.log(error)
    return next(Boom.badImplementation('Invalid User'))
  }
}

const deleteSubDistributor = (sd) => {
  return new Promise(async (resolve, reject) => {
    const userWallet = await getWallet({ _id: sd.wallet._id })
    const distributorWallet = await getWallet({ user: sd.distributor._id })
    const subUsers = await getAllUsers({ subDistributor: sd._id })
    let total = 0
    let $promises = []
    for (let i = 0; i < subUsers.length; i++) {
      total = total + subUsers[i].wallet.credits
      $promises.push(deleteUser({ _id: subUsers[i]._id }))
      $promises.push(deleteWallet({ user: subUsers[i]._id }))
    }
    await Promise.all($promises)
    await updateWallet({ user: sd.distributor._id }, { credits: distributorWallet.credits + userWallet.credits + total })
    await deleteWallet({ _id: sd.wallet._id })
    resolve()
  })
}