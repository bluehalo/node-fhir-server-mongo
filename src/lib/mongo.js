const { MongoClient } = require('mongodb');
const logger = require('@bluehalo/node-fhir-server-core').loggers.get();

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

/**
 * Mongo error handler
 * @param error The Exception
 * @param code The http rejection code
 * @param message The error message
 * @returns Promise.reject
 */
let handleError = (params = {}) => {
  let { error = null, code = 400, message = null } = params;
  // Customize based on error types
  if (!message) {
    if (error.name === 'MongoNetworkError') {
      message = 'Network issue occurred while connecting to the database.';
    } else if (error.name === 'MongoWriteError') {
      message = 'Failed to write data to the database.';
    } else if (error.name === 'MongoServerError') {
      message = 'Database server error.';
    } else if (error.name === 'MongoServerSelectionError') {
      message = 'Database server selection error.';
    } else {
      message = 'An unexpected database error occurred.';
    }

    // Log the detailed error for internal debugging
    logger.error(`Detailed ${error.name} Error:`, error);
  }

  // Return a controlled message for the end user
  return { code: code, message: message };
  // return error
};

module.exports = {
  connect,
  handleError,
};
