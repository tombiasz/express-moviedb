const express = require('express');

const {
  checkValidationErrors,
  getAllMovies,
  findOrCreateMovie,
  sanitizeMovie,
  validateMovie,
} = require('../middlewares/movies');


const router = express.Router();

router
  .route('/')
  .get(getAllMovies)
  .post(validateMovie, checkValidationErrors, sanitizeMovie, findOrCreateMovie);

module.exports = router;
