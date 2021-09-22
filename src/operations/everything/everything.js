const {logRequest, logDebug, logError} = require('../common/logging');
const {verifyHasValidScopes} = require('../security/scopes');
const practitionerEverythingGraph = require('../../graphs/practitioner/everything.json');
const organizationEverythingGraph = require('../../graphs/organization/everything.json');
const slotEverythingGraph = require('../../graphs/slot/everything.json');
const {BadRequestError} = require('../../utils/httpErrors');
const {graph} = require('../graph/graph');
/**
 * does a FHIR $everything
 * @param {string[]} args
 * @param {IncomingMessage} req
 * @param {string} resource_name
 * @param {string} collection_name
 */
module.exports.everything = async (args, {req}, resource_name, collection_name) => {
    logRequest(req.user, `${resource_name} >>> everything`);
    verifyHasValidScopes(resource_name, 'read', req.user, req.authInfo && req.authInfo.scope);

    try {
        let {id} = args;

        logRequest(req.user, `id=${id}`);
        logDebug(req.user, `req=${req}`);

        let query = {};
        query.id = id;
        // Grab an instance of our DB and collection
        if (collection_name === 'Practitioner') {
            // noinspection JSUndefinedPropertyAssignment
            req.body = practitionerEverythingGraph;
            return await graph(args, {req}, resource_name, collection_name);
        } else if (collection_name === 'Organization') {
            // noinspection JSUndefinedPropertyAssignment
            req.body = organizationEverythingGraph;
            return await graph(args, {req}, resource_name, collection_name);
        } else if (collection_name === 'Slot') {
            // noinspection JSUndefinedPropertyAssignment
            req.body = slotEverythingGraph;
            return await graph(args, {req}, resource_name, collection_name);
        } else {
            // noinspection ExceptionCaughtLocallyJS
            throw new Error('$everything is not supported for resource: ' + collection_name);
        }
    } catch (err) {
        logError(req.user, `Error with ${resource_name}.everything: ${err} `);
        throw new BadRequestError(err);
    }
};
