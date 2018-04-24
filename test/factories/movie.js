const faker = require('faker');

const models = require('../../models');
const omdbDocumentFactory = require('./omdb-document');


const getMovie = (props = {}) => {
  const defaultProps = {
    title: faker.random.word(),
    document: omdbDocumentFactory(),
  };

  return { ...defaultProps, ...props };
  // return Object.assign({}, defaultProps, props);
};

module.exports = (props = {}) => models.Movie.create(getMovie(props));
