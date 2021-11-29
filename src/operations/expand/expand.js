const {logRequest, logDebug, logError} = require('../common/logging');
const {verifyHasValidScopes, isAccessToResourceAllowedBySecurityTags} = require('../security/scopes');
const globals = require('../../globals');
const {CLIENT_DB} = require('../../constants');
const {getResource} = require('../common/getResource');
const {BadRequestError, ForbiddenError, NotFoundError} = require('../../utils/httpErrors');
const {enrich} = require('../../enrich/enrich');
/**
 * does a FHIR Search By Id
 * @param {Object} args
 * @param {string} user
 * @param {string} scope
 * @param {string} resource_name
 * @param {string} collection_name
 * @return {Resource}
 */
// eslint-disable-next-line no-unused-vars
module.exports.expand = async (args, user, scope, resource_name, collection_name) => {
    logRequest(user, `${resource_name} >>> expand`);
    logDebug(user, JSON.stringify(args));

    verifyHasValidScopes(resource_name, 'read', user, scope);

    // Common search params
    let {id} = args;
    let {base_version} = args;

    logDebug(user, `id: ${id}`);
    logDebug(user, `base_version: ${base_version}`);

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
        if (!(isAccessToResourceAllowedBySecurityTags(resource, user, scope))) {
            throw new ForbiddenError(
                'user ' + user + ' with scopes [' + scope + '] has no access to resource ' +
                resource.resourceType + ' with id ' + id);
        }
        // run any enrichment
        resource = (await enrich([resource], resource_name))[0];
        return new Resource(resource);
    } else {
        throw new NotFoundError(`Not Found: ${resource_name}.searchById: ${id.toString()}`);
    }
};
