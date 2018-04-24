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
  test: {
    use_env_variable: 'TEST_DATABASE_URL',
    native: true,
    quoteIdentifiers: false,
  },
};
