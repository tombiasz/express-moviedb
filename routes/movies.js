const express = require('express');

const { getAllMovies } = require('../middlewares/movies');


const router = express.Router();

router.get('/', getAllMovies);

router.post('/', (req, res) => {
  const { title } = req.body;
  res.json(title);
});

module.exports = router;
