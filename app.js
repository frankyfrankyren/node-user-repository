var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var userRepo = require('./repository/nedb-user-repository')();

var users = require('./routes/users')(userRepo);
var user = require('./routes/user')(userRepo);

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/users', users);
app.use('/user', user);

module.exports = app;
module.exports.userRepo = userRepo;
