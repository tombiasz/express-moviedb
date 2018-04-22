const dotenv = require('dotenv');


dotenv.config();

module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    native: true,
  },
  production: {
    url: process.env.DATABASE_URL,
    native: true,
  },
};
