const {logRequest, logDebug, logError} = require('../common/logging');
const {verifyHasValidScopes, isAccessToResourceAllowedBySecurityTags} = require('../security/scopes');
const globals = require('../../globals');
const {CLIENT_DB} = require('../../constants');
const {getResource} = require('../common/getResource');
const {BadRequestError, ForbiddenError, NotFoundError} = require('../../utils/httpErrors');
/**
 * does a FHIR Search By Id
 * @param {string[]} args
 * @param {IncomingMessage} req
 * @param {string} resource_name
 * @param {string} collection_name
 */
// eslint-disable-next-line no-unused-vars
module.exports.searchById = async (args, {req}, resource_name, collection_name) => {
    logRequest(req.user, `${resource_name} >>> searchById`);
    logDebug(req.user, JSON.stringify(args));

    verifyHasValidScopes(resource_name, 'read', req.user, req.authInfo && req.authInfo.scope);

    // Common search params
    let {id} = args;
    let {base_version} = args;

    logDebug(req.user, `id: ${id}`);
    logDebug(req.user, `base_version: ${base_version}`);

    // Search Result param

    let query = {};
    query.id = id;
    // TODO: Build query from Parameters

    // TODO: Query database
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(`${collection_name}_${base_version}`);
    let Resource = getResource(base_version, resource_name);

    let resource;
    try {
        resource = await collection.findOne({id: id.toString()});
    } catch (e) {
        logError(`Error with ${resource_name}.searchById: `, e);
        throw new BadRequestError(e);
    }
    if (resource) {
        if (!(isAccessToResourceAllowedBySecurityTags(resource, req))) {
            throw new ForbiddenError(
                'user ' + req.user + ' with scopes [' + req.authInfo.scope + '] has no access to resource ' +
                resource.resourceType + ' with id ' + id);
        }
        return new Resource(resource);
    } else {
        throw new NotFoundError();
    }
};
