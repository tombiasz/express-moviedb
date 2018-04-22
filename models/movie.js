'use strict';
module.exports = (sequelize, DataTypes) => {
  var Movie = sequelize.define('Movie', {
    title: DataTypes.STRING
  }, {});
  Movie.associate = function(models) {
    // associations can be defined here
  };
  return Movie;
};