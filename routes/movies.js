const express = require('express');

const {
  getAllMovies,
  createMovie,
} = require('../middlewares/movies');


const router = express.Router();

router.get('/', getAllMovies);
router.post('/', createMovie);

module.exports = router;
