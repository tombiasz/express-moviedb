const express = require('express');

const {
  createComment,
  getAllComments,
  sanitizeComment,
  sanitizeGetAllCommentsQueryParams,
  validateComment,
} = require('../middlewares/comment');
const {
  checkValidationErrors,
} = require('../middlewares/common');


const router = express.Router();

router
  .route('/')
  .get(sanitizeGetAllCommentsQueryParams, getAllComments)
  .post(validateComment, checkValidationErrors, sanitizeComment, createComment);

module.exports = router;
