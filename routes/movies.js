const express = require('express');

const {
  getAllMovies,
  findOrCreateMovie,
  validateMovie,
} = require('../middlewares/movies');


const router = express.Router();

router
  .route('/')
  .get(getAllMovies)
  .post(validateMovie, findOrCreateMovie);

module.exports = router;
