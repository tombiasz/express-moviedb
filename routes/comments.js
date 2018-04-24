const express = require('express');

const {
  createComment,
  getAllComments,
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
  .post(validateComment, checkValidationErrors, createComment);

module.exports = router;
