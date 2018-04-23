const express = require('express');

const {
  createComment,
  getAllComments,
  sanitizeGetAllCommentsQueryParams,
  validateComment,
} = require('../middlewares/comments');


const router = express.Router();

router
  .route('/')
  .get(sanitizeGetAllCommentsQueryParams, getAllComments)
  .post(validateComment, createComment);

module.exports = router;
