module.exports = (sequelize, DataTypes) => {
  const Movie = sequelize.define('Movie', {
    title: DataTypes.STRING,
    document: DataTypes.JSONB,
  }, {});

  Movie.associate = (models) => {
    Movie.hasMany(models.Comment);
  };

  return Movie;
};
