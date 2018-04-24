const express = require('express');

const {
  checkValidationErrors,
  getAllMovies,
  findOrCreateMovie,
  validateMovie,
} = require('../middlewares/movies');


const router = express.Router();

router
  .route('/')
  .get(getAllMovies)
  .post(validateMovie, checkValidationErrors, findOrCreateMovie);

module.exports = router;
