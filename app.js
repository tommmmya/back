var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const cors = require('cors')
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors())
app.use('/', indexRouter);
app.use('/users', usersRouter);
module.exports = app;
