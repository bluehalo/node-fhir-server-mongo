const {logRequest} = require('../common/logging');
const {verifyHasValidScopes, isAccessToResourceAllowedBySecurityTags} = require('../security/scopes');
const {getResource} = require('../common/getResource');
const globals = require('../../globals');
const {CLIENT_DB} = require('../../constants');
const {BadRequestError, ForbiddenError, NotFoundError} = require('../../utils/httpErrors');
const {enrich} = require('../../enrich/enrich');
/**
 * does a FHIR Search By Version
 * @param {Object} args
 * @param {string} user
 * @param {string} scope
 * @param {string} resource_name
 * @param {string} collection_name
 */
// eslint-disable-next-line no-unused-vars
module.exports.searchByVersionId = async (args, user, scope, resource_name, collection_name) => {
    logRequest(user, `${resource_name} >>> searchByVersionId`);
    verifyHasValidScopes(resource_name, 'read', user, scope);

    let {base_version, id, version_id} = args;

    let Resource = getResource(base_version, resource_name);

    let db = globals.get(CLIENT_DB);
    let history_collection = db.collection(`${collection_name}_${base_version}_History`);

    // Query our collection for this observation
    let resource;
    try {
        resource = await history_collection.findOne(
            {id: id.toString(), 'meta.versionId': `${version_id}`});
    } catch (e) {
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
        return (new Resource(resource));
    } else {
        throw new NotFoundError();
    }
};
