const express = require('express');

const {
  getAllMovies,
  findOrCreateMovie,
  sanitizeMovie,
  validateMovie,
} = require('../middlewares/movies');
const {
  checkValidationErrors,
} = require('../middlewares/commons');


const router = express.Router();

router
  .route('/')
  .get(getAllMovies)
  .post(validateMovie, checkValidationErrors, sanitizeMovie, findOrCreateMovie);

module.exports = router;
