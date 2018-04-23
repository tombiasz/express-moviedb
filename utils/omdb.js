const omdbApi = require('omdb-client');


exports.getMovieByTitle = (title) => {
  const params = {
    apiKey: process.env.OMDB_API_KEY,
    title,
  };

  return new Promise((resolve, reject) => {
    omdbApi.get(params, (err, data) => {
      if (err) return reject(err);

      return resolve(data);
    });
  });
};
