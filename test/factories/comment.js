const faker = require('faker');

const models = require('../../models');


const getComment = (movieId, props = {}) => {
  const defaultProps = {
    body: faker.lorem.sentence(),
    MovieId: movieId,
  };

  return { ...defaultProps, ...props };
};

module.exports = (movieId, props = {}) => models.Comment.create(getComment(movieId, props));
