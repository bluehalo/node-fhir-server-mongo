const env = require('var');
/**
 * @type {import('winston').logger}
 */
const logger = require('@asymmetrik/node-fhir-server-core').loggers.get();
/**
 * Always logs regardless of env.IS_PRODUCTION
 * @param {string} user
 * @param {*} msg
 */
module.exports.logRequest = (user, msg) => {
    logger.info(user + ': ' + msg);
};

/**
 * Logs as info if env.IS_PRODUCTION is not set
 * @param {string} user
 * @param {*} msg
 */
module.exports.logDebug = (user, msg) => {
    if (!env.IS_PRODUCTION || (env.LOGLEVEL === 'DEBUG')) {
        logger.info(user + ': ' + msg);
    }
};

/**
 * Logs as error
 * @param {string} user
 * @param {*} msg
 */
module.exports.logError = (user, msg) => {
    logger.error(user + ': ' + msg);
};

/**
 * Logs as warning
 * @param {string} user
 * @param {*} msg
 */
module.exports.logWarn = (user, msg) => {
    logger.warn(user + ': ' + msg);
};
