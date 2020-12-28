import createError from 'http-errors';
import express from 'express';
import path from 'path';
import ora from 'ora';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import MakeDb from './database/connection';
const mongoThrobber = ora();

import indexRouter from './routes/index';
import config from './config';

const app = express();

new MakeDb()
  .then(() => {
    mongoThrobber.succeed(`${config.app_name}-DB  Ready!`)
  }).catch((err) => {
    mongoThrobber.fail(`Could not connect to ${config.app_name}-DB because of ${err}`)
  })

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
