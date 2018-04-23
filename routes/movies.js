const express = require('express');

const {
  getAllMovies,
  createMovie,
} = require('../middlewares/movies');


const router = express.Router();

router
  .route('/')
  .get(getAllMovies)
  .post(createMovie);

module.exports = router;
