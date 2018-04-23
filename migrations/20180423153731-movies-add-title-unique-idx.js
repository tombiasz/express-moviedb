module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addIndex(
      'Movies',
      {
        fields: ['title'],
        unique: true,
        name: 'movies_title_unique_idx',
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeIndex('Movies', 'movies_title_unique_idx');
  }
};
