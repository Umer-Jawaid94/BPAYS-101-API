require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

const database = require('./common/database');

var app = express();
database.connect();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.get(`/health`, function (req, res) {
  // TOD Ping DB
  res.json({
    message: 'Health Check Complete',
    success: true,
    data : {
      env : process.env.NODE_ENV
    }
  });
});

module.exports = app;
