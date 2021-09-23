const {logRequest, logError} = require('../common/logging');
const {verifyHasValidScopes} = require('../security/scopes');
const practitionerEverythingGraph = require('../../graphs/practitioner/everything.json');
const organizationEverythingGraph = require('../../graphs/organization/everything.json');
const slotEverythingGraph = require('../../graphs/slot/everything.json');
const {BadRequestError} = require('../../utils/httpErrors');
const {graph} = require('../graph/graph');
/**
 * does a FHIR $everything
 * @param {string[]} args
 * @param {string} user
 * @param {string} scope
 * @param {string} path
 * @param {string} host
 * @param {string} resource_name
 * @param {string} collection_name
 */
module.exports.everything = async (args, user, scope, path, host, resource_name, collection_name) => {
    logRequest(user, `${resource_name} >>> everything`);
    verifyHasValidScopes(resource_name, 'read', user, scope);

    try {
        let {id} = args;

        logRequest(user, `id=${id}`);

        let query = {};
        query.id = id;
        // Grab an instance of our DB and collection
        if (collection_name === 'Practitioner') {
            return await graph(args, user, scope, practitionerEverythingGraph, path, host, resource_name, collection_name);
        } else if (collection_name === 'Organization') {
            return await graph(args, user, scope, organizationEverythingGraph, path, host, resource_name, collection_name);
        } else if (collection_name === 'Slot') {
            return await graph(args, user, scope, slotEverythingGraph, path, host, resource_name, collection_name);
        } else {
            // noinspection ExceptionCaughtLocallyJS
            throw new Error('$everything is not supported for resource: ' + collection_name);
        }
    } catch (err) {
        logError(user, `Error with ${resource_name}.everything: ${err} `);
        throw new BadRequestError(err);
    }
};
