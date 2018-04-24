const express = require('express');

const {
  createComment,
  getAllComments,
  sanitizeComment,
  sanitizeGetAllCommentsQueryParams,
  validateComment,
} = require('../middlewares/comments');
const {
  checkValidationErrors,
} = require('../middlewares/commons');


const router = express.Router();

router
  .route('/')
  .get(sanitizeGetAllCommentsQueryParams, getAllComments)
  .post(validateComment, checkValidationErrors, sanitizeComment, createComment);

module.exports = router;
