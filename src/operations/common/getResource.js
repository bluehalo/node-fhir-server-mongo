const {resolveSchema} = require('@asymmetrik/node-fhir-server-core');
/**
 * Gets class for the given resource_name and version
 * @param {string} base_version
 * @param {string} resource_name
 * @returns {function(?Object):Resource}
 */
module.exports.getResource = (base_version, resource_name) => {
    return resolveSchema(base_version, resource_name);
};
