module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Movies', [{
      title: 'Test',
      createdAt: Sequelize.fn('NOW'),
      updatedAt: Sequelize.fn('NOW'),
      document: JSON.stringify({"Title":"Test","Year":"2013"}),
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Movies', null, {});
  }
};
