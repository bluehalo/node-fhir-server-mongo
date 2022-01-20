const {logRequest, logDebug, logError} = require('../common/logging');
const {verifyHasValidScopes} = require('../security/scopes');
const globals = require('../../globals');
const {CLIENT_DB} = require('../../constants');
const {NotAllowedError} = require('../../utils/httpErrors');
/**
 * does a FHIR Remove (DELETE)
 * @param {Object} args
 * @param {string} user
 * @param {string} scope
 * @param {string} resource_name
 * @param {string} collection_name
 */
// eslint-disable-next-line no-unused-vars
module.exports.remove = async (args, user, scope, resource_name, collection_name) => {
    logRequest(user, `${resource_name} >>> remove`);
    verifyHasValidScopes(resource_name, 'write', user, scope);

    let {base_version, id} = args;

    logDebug(user, `Deleting id=${id}`);

    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(`${collection_name}_${base_version}`);
    // Delete our resource record
    let res;
    try {
        res = await collection.deleteOne({id: id});
    } catch (e) {
        logError(user, `Error with ${resource_name}.remove`);
        throw new NotAllowedError(e.message);
    }
    // delete history as well.  You can chose to save history.  Up to you
    let history_collection = db.collection(`${collection_name}_${base_version}_History`);
    try {
        await history_collection.deleteMany({id: id});
    } catch (e) {
        logError(user, `Error with ${resource_name}.remove`);
        throw new NotAllowedError(e.message);
    }
    return {deleted: res.result && res.result.n};
};