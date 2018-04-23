const express = require('express');

const models = require('../models');


const router = express.Router();

router.get('/', (req, res) => {
  models.Movie
    .findAll()
    .then(movies => res.json(movies));
});

module.exports = router;
