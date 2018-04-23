const models = require('../models');


exports.getAllComments = (req, res) => {
  models.Comment
    .findAll()
    .then(comments => res.json(comments));
};
