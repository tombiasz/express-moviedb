const models = require('../models');


exports.getAllMovies = (req, res) => {
  models.Movie
    .findAll()
    .then(movies => res.json(movies));
};

exports.createMovie = (req, res) => {
  const { title } = req.body;
  res.json(title);
};
