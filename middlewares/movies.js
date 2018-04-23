const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const omdbApi = require('omdb-client');

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

exports.createMovie = (req, res, next) => {
  const { title } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res
      .status(400)
      .json(errors.mapped());
  } else {
    const params = {
      apiKey: process.env.OMDB_API_KEY,
      title,
    };
    omdbApi.get(params, (err, data) => {
      if (err) {
        res.status(404).json({ msg: 'Movie not found' });
        return;
      }

      res.json(data);
    });
  }
};
