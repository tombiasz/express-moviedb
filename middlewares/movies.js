const models = require('../models');


exports.getAllMovies = (req, res) => {
  models.Movie
    .findAll()
    .then(movies => res.json(movies));
};
