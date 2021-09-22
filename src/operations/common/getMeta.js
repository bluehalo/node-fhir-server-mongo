const {resolveSchema} = require('@asymmetrik/node-fhir-server-core');

/**
 * Gets class for Meta
 * @param {string} base_version
 * @returns {function({Object}):Meta} Meta class
 */
module.exports.getMeta = (base_version) => {
    return resolveSchema(base_version, 'Meta');
};
