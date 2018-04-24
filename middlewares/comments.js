const { body, validationResult } = require('express-validator/check');
const { sanitizeBody, sanitizeQuery } = require('express-validator/filter');

const models = require('../models');

exports.sanitizeGetAllCommentsQueryParams = [
  sanitizeQuery('movieId')
    .toInt(),
];

exports.getAllComments = (req, res) => {
  const { movieId } = req.query;
  const options = { where: {} };

  if (movieId) {
    options.where.movieId = movieId;
  }
  models.Comment
    .findAll(options)
    .then(comments => res.json(comments));
};

exports.validateComment = [
  body('movieId')
    .trim()
    .exists()
    .toInt()
    .withMessage('Movie ID must be specified.')
    .isInt()
    .withMessage('Movie ID must be an integer')
    .custom((value) => {
      return new Promise((resolve, reject) => {
        models.Movie
          .findOne({ where: { id: value } })
          .then((movie) => {
            if (movie) {
              return resolve();
            }
            return reject();
          });
      });
    })
    .withMessage('Invalid Movie ID'),

  body('body')
    .trim()
    .exists()
    .withMessage('Body must be specified.')
    .isLength({ min: 1 })
    .withMessage('Body must be at least 1 character long.'),
];

exports.sanitizeComment = [
  sanitizeBody('movieId')
    .trim()
    .toInt(),

  sanitizeBody('body')
    .trim()
    .escape(),
];

exports.createComment = (req, res) => {
  const { movieId, body } = req.body;

  models.Comment
    .create({ movieId, body })
    .then(comment => res.json(comment));
};
