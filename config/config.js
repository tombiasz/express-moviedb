const dotenv = require('dotenv');


dotenv.config();

module.exports = {
  development: {
    use_env_variable: 'DATABASE_URL',
    native: true,
    quoteIdentifiers: false,
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    native: true,
    quoteIdentifiers: false,
  },
};
