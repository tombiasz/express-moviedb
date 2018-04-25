const express = require('express');

const {
  createMovie,
  findMovie,
  findMovieInOMDB,
  getAllMovies,
  sanitizeGetAllMoviesQueryParams,
  sanitizeMovie,
  validateMovie,
} = require('../middlewares/movie');
const {
  checkValidationErrors,
} = require('../middlewares/common');


const router = express.Router();

router
  .route('/')
  .get(sanitizeGetAllMoviesQueryParams, getAllMovies)
  .post(
    validateMovie,
    checkValidationErrors,
    sanitizeMovie,
    findMovie,
    findMovieInOMDB,
    createMovie,
  );

module.exports = router;
