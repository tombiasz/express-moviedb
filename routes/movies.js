const express = require('express');

const {
  createMovie,
  findMovie,
  findMovieInOMDB,
  getAllMovies,
  sanitizeMovie,
  validateMovie,
} = require('../middlewares/movie');
const {
  checkValidationErrors,
} = require('../middlewares/common');


const router = express.Router();

router
  .route('/')
  .get(getAllMovies)
  .post(
    validateMovie,
    checkValidationErrors,
    sanitizeMovie,
    findMovie,
    findMovieInOMDB,
    createMovie,
  );

module.exports = router;
