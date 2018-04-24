const express = require('express');

const {
  getAllMovies,
  findOrCreateMovie,
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
  .post(validateMovie, checkValidationErrors, sanitizeMovie, findOrCreateMovie);

module.exports = router;
