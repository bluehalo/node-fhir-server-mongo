const {logRequest, logError} = require('../common/logging');
const {verifyHasValidScopes} = require('../security/scopes');
const practitionerEverythingGraph = require('../../graphs/practitioner/everything.json');
const organizationEverythingGraph = require('../../graphs/organization/everything.json');
const slotEverythingGraph = require('../../graphs/slot/everything.json');
const {BadRequestError} = require('../../utils/httpErrors');
const {graph} = require('../graph/graph');
/**
 * does a FHIR $everything
 * @param {import('../../utils/requestInfo').RequestInfo} requestInfo
 * @param {Object} args
 * @param {string} resource_name
 * @param {string} collection_name
 */
module.exports.everything = async (requestInfo, args, resource_name,
                                   collection_name) => {
    const user = requestInfo.user;
    const scope = requestInfo.scope;
    logRequest(user, `${resource_name} >>> everything`);
    verifyHasValidScopes(resource_name, 'read', user, scope);

    try {
        let {id} = args;

        logRequest(user, `id=${id}`);

        let query = {};
        query.id = id;
        // Grab an instance of our DB and collection
        if (collection_name === 'Practitioner') {
            requestInfo.body = practitionerEverythingGraph;
            return await graph(requestInfo, args, resource_name, collection_name);
        } else if (collection_name === 'Organization') {
            requestInfo.body = organizationEverythingGraph;
            return await graph(requestInfo, args, resource_name, collection_name);
        } else if (collection_name === 'Slot') {
            requestInfo.body = slotEverythingGraph;
            return await graph(requestInfo, args, resource_name, collection_name);
        } else {
            // noinspection ExceptionCaughtLocallyJS
            throw new Error('$everything is not supported for resource: ' + collection_name);
        }
    } catch (err) {
        logError(user, `Error with ${resource_name}.everything: ${err} `);
        throw new BadRequestError(err);
    }
};
