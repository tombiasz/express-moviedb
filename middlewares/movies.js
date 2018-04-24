const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

const omdb = require('../utils/omdb');
const models = require('../models');


exports.getAllMovies = (req, res) => {
  models.Movie
    .findAll()
    .then(movies => res.json(movies));
};

exports.validateMovie = [
  body('title')
    .trim()
    .exists()
    .withMessage('Title must be specified.')
    .isLength({ min: 1 })
    .withMessage('Title must be at least 1 character long.'),

  sanitizeBody('title')
    .trim()
    .escape(),
];

exports.checkValidationErrors = (req, res, next) => {
  const mapped = true;
  return req
    .asyncValidationErrors(mapped)
    .then(next)
    .catch(errors => res.status(400).json(errors));
};

exports.findOrCreateMovie = (req, res) => {
  const { title } = req.body;

  models.Movie
    .find({ where: { title } })
    .then((movie) => {
      if (movie) {
        res.json(movie);
      } else {
        omdb
          .getMovieByTitle(title)
          .then((document) => {
            models.Movie
              .create({ title, document })
              .then(created => res.json(created));
          })
          .catch((err) => {
            res.status(404).json({ msg: err });
          });
      }
    });
};
