const express = require('express');

const {
  createComment,
  getAllComments,
  validateComment,
} = require('../middlewares/comments');


const router = express.Router();

router
  .route('/')
  .get(getAllComments)
  .post(validateComment, createComment);

module.exports = router;
