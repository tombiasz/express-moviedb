const express = require('express');

const {
  getAllComments,
} = require('../middlewares/comments');


const router = express.Router();

router
  .route('/')
  .get(getAllComments)

module.exports = router;
