'use strict';
module.exports = (sequelize, DataTypes) => {
  var Movie = sequelize.define('Movie', {
    title: DataTypes.STRING,
    document: DataTypes.JSONB,
  }, {});
  Movie.associate = function(models) {
    // associations can be defined here
  };
  return Movie;
};