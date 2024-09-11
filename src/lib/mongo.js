const { MongoClient } = require('mongodb');

/**
 * @name connect
 * @summary Connect to Mongo
 * @param {string} url - URL connections string for mongo
 * @param {Object} options - Any options for Mongo
 * @return {Promise<MongoClient>}
 */
let connect = (url, options) =>
  new Promise((resolve, reject) => {
    try {
      const client = new MongoClient(url, options);
      return resolve(client);
    } catch (e) {
      return reject(e);
    }
  });

module.exports = connect;
