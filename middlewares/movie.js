const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

const omdb = require('../utils/omdb');
const models = require('../models');


exports.getAllMovies = (req, res) =>
  models.Movie
    .findAll()
    .then(movies => res.json(movies));

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
