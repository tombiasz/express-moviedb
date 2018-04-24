const createError = require('http-errors');
const express = require('express');
const expressValidator = require('express-validator');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const moviesRouter = require('./routes/movies');
const commentsRouter = require('./routes/comments');


const app = express();

dotenv.config();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressValidator());

app.use('/movies', moviesRouter);
app.use('/comments', commentsRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => next(createError(404)));

// error handler
app.use((err, req, res, next) => {
  const msg = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.json({ msg });
});

module.exports = app;
