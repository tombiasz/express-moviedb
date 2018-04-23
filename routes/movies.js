const express = require('express');

const {
  getAllMovies,
  createMovie,
  validateMovie,
} = require('../middlewares/movies');


const router = express.Router();

router
  .route('/')
  .get(getAllMovies)
  .post(validateMovie, createMovie);

module.exports = router;
