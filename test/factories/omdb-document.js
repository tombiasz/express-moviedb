const faker = require('faker');


const getOMDBDocument = (props = {}) => {
  const defaultProps = {
    Title: faker.random.word(),
    Plot: faker.lorem.sentence(),
    Year: faker.date.past(100).getFullYear(),
  };

  return { ...defaultProps, ...props };
};

module.exports = (props = {}) => getOMDBDocument(props);
