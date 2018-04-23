module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Movies',
      'document',
      {
        type: Sequelize.JSONB,
        allowNull: false,
      }
    ).then(() => {
      // return queryInterface
      //   .sequelize
      //   .query('create unique index movies_document_title_unique_idx on "Movies"((document->>\'Title\'))');
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface
      .removeIndex('Movies', 'movies_document_title_unique_idx')
      .then(() => queryInterface.removeColumn('Movies', 'document'));
  },
};
