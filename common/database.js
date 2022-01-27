// const config = require('@config');
const mongoose = require('mongoose');
const log = require('./log');
const url = process.env.MONGO_URL;

exports.connect = () => {
  const options = {
    reconnectInterval: 10000,
    reconnectTries: 60,
    useNewUrlParser: true,
    useFindAndModify: false
    // useUnifiedTopology: true,
    // serverSelectionTimeoutMS: 5000
  };
  mongoose.connect(url, options);

  const connection = mongoose.connection;

  connection.on('error', function (err) {
    // If first connect fails because mongod is down, try again later.
    // This is only needed for first connect, not for runtime reconnects.
    // See: https://github.com/Automattic/mongoose/issues/5169
    log('DB ERROR');
    log(new Date(), String(err));

    // Wait for a bit, then try to connect again
    setTimeout(function () {
      log(connection.readyState);
      if (connection.readyState !== 0 || connection.readyState !== 3) {
        log('CONNECTED');
      } else {
        connection.openUri(url, options).catch(error => { log(new Date(), String(error)); });
      }
      // Why the empty catch?
      // Well, errors thrown by db.open() will also be passed to .on('error'),
      // so we can handle them there, no need to log anything in the catch here.
      // But we still need this empty catch to avoid unhandled rejections.
    }, 60 * 1000);
  });

  connection.on('disconnected', () => {
    setTimeout(function () {
      log(connection.readyState);
      if (connection.readyState < 3 && connection.readyState > 0) {
        log('DISCONNECTED');
      } else {
        connection.openUri(url, options).catch(err => { log(new Date(), String(err)); });
      }
      // Why the empty catch?
      // Well, errors thrown by db.open() will also be passed to .on('error'),
      // so we can handle them there, no need to log anything in the catch here.
      // But we still need this empty catch to avoid unhandled rejections.
    }, 60 * 1000);
  });

  connection.on(`open`, function () {
    // we`re connected!
    log(`INTERNSHIP DB Connected`);
    log(`###########################################################################`);
  });
};

