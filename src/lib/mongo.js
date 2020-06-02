const { MongoClient } = require('mongodb');

/**
 * @name connect
 * @summary Connect to Mongo
 * @param {string} url - URL connections string for mongo
 * @param {Object} options - Any options for Mongo
 * @return {Promise}
 */
let connect = (url, options) =>
  new Promise((resolve, reject) => {
    // Connect to mongo
    MongoClient.connect(url, options, (err, client) => {
      if (err) {
        return reject(err);
      }
      return resolve(client);
    });
  });

module.exports = connect;
