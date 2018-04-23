const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

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

exports.createMovie = (req, res) => {
  const { title } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res
      .status(400)
      .json(errors.mapped());
  } else {
    res.json(title);
  }
};
