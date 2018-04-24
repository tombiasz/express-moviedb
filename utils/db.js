const models = require('../models');

exports.rebuildDatabase = () => models.sequelize.sync({ force: true });
