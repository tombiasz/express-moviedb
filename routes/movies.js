const express = require('express');

const models = require('../models');


const router = express.Router();

router.get('/', (req, res) => {
  models.Movie
    .findAll()
    .then(movies => res.json(movies));
});

router.post('/', (req, res) => {
  const { title } = req.body;
  res.json(title);
});

module.exports = router;
