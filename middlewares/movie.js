const { body, query } = require('express-validator/check');
const { sanitizeBody, sanitizeQuery } = require('express-validator/filter');

const omdb = require('../utils/omdb');
const models = require('../models');


const ORDER_ASC = 'ASC';
const ORDER_DESC = 'DESC';

exports.sanitizeGetAllMoviesQueryParams = [
  sanitizeQuery('orderByTitle')
    .trim()
    .customSanitizer((value) => {
      try {
        switch (value.toUpperCase()) {
          case ORDER_DESC:
            return ORDER_DESC;
          case ORDER_ASC:
            return ORDER_ASC;
          default:
            return ORDER_DESC;
        }
      } catch (e) {
        return ORDER_DESC;
      }
    }),
];

exports.getAllMovies = (req, res) => {
  const { orderByTitle } = req.query;
  const options = {
    where: {},
  };

  if (orderByTitle) {
    options.order = [
      ['title', orderByTitle],
    ];
  }

  return models.Movie
    .findAll(options)
    .then(movies => res.json(movies));
};

exports.validateMovie = [
  body('title')
    .trim()
    .exists()
    .withMessage('Title must be specified.')
    .isLength({ min: 1 })
    .withMessage('Title must be at least 1 character long.'),
];

exports.sanitizeMovie = [
  sanitizeBody('title')
    .trim()
    .escape(),
];

exports.findMovie = (req, res, next) => {
  const { title } = req.body;

  return models.Movie
    .find({ where: { title } })
    .then((movie) => {
      if (movie) {
        return res.json(movie);
      }
      return next();
    });
};

exports.findMovieInOMDB = (req, res, next) => {
  const { title } = req.body;

  return omdb
    .getMovieByTitle(title)
    .then((movieDocument) => {
      res.locals.movieDocument = movieDocument;
      return next();
    })
    .catch(err => res.status(404).json({ msg: err }));
};

exports.createMovie = (req, res) => {
  const { title } = req.body;
  const document = res.locals.movieDocument;

  return models.Movie
    .create({ title, document })
    .then(created => res.json(created));
};
