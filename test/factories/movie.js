const faker = require('faker');

const models = require('../../models');


const getOMDBDocument = () => {
  return {
    Title: faker.random.word(),
    Plot: faker.lorem.sentence(),
    Year: faker.date.past(100).getFullYear(),
  };
};

const getMovie = (props = {}) => {
  const defaultProps = {
    title: faker.random.word(),
    document: getOMDBDocument(),
  };

  return { ...defaultProps, ...props };
  // return Object.assign({}, defaultProps, props);
};

module.exports = (props = {}) => models.Movie.create(getMovie(props));
