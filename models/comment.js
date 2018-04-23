module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    body: DataTypes.TEXT,
    movieId: DataTypes.INTEGER,
  }, {});

  Comment.associate = (models) => {
    Comment.belongsTo(models.Movie);
  };

  return Comment;
};
