const {logRequest, logError} = require('../common/logging');
const {verifyHasValidScopes} = require('../security/scopes');
const globals = require('../../globals');
const {CLIENT_DB} = require('../../constants');
const {BadRequestError, NotFoundError} = require('../../utils/httpErrors');
const {validate, applyPatch} = require('fast-json-patch');
const {getResource} = require('../common/getResource');
/**
 * does a FHIR Patch
 * @param {string[]} args
 * @param {string} user
 * @param {string} scope
 * @param {string} resource_name
 * @param {string} collection_name
 */
// eslint-disable-next-line no-unused-vars
module.exports.patch = async (args, user, scope, resource_name, collection_name) => {
    logRequest(user, 'Patient >>> patch');
    verifyHasValidScopes(resource_name, 'write', user, scope);

    let {base_version, id, patchContent} = args;

    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(`${collection_name}_${base_version}`);

    // Get current record
    // Query our collection for this observation
    let data;
    try {
        data = await collection.findOne({id: id.toString()});
    } catch (e) {
        logError(user, `Error with ${resource_name}.patch: ${e} `);
        throw new BadRequestError(e);
    }
    if (!data) {
        throw new NotFoundError();
    }
    // Validate the patch
    let errors = validate(patchContent, data);
    if (errors && Object.keys(errors).length > 0) {
        logError(user, 'Error with patch contents');
        throw new BadRequestError(errors[0]);
    }
    // Make the changes indicated in the patch
    let resource_incoming = applyPatch(data, patchContent).newDocument;

    let Resource = getResource(base_version, resource_name);
    let resource = new Resource(resource_incoming);

    if (data && data.meta) {
        let foundResource = new Resource(data);
        let meta = foundResource.meta;
        // noinspection JSUnresolvedVariable
        meta.versionId = `${parseInt(foundResource.meta.versionId) + 1}`;
        resource.meta = meta;
    } else {
        throw new BadRequestError(new Error('Unable to patch resource. Missing either data or metadata.'));
    }

    // Same as update from this point on
    let cleaned = JSON.parse(JSON.stringify(resource));
    let doc = Object.assign(cleaned, {_id: id});

    // Insert/update our resource record
    let res;
    try {
        res = await collection.findOneAndUpdate({id: id}, {$set: doc}, {upsert: true});
    } catch (e) {
        logError(user, `Error with ${resource_name}.update: ${e}`);
        throw new BadRequestError(e);
    }
    // Save to history
    let history_collection = db.collection(`${collection_name}_${base_version}_History`);
    let history_resource = Object.assign(cleaned, {_id: id + cleaned.meta.versionId});

    // Insert our resource record to history but don't assign _id
    try {
        await history_collection.insertOne(history_resource);
    } catch (e) {
        logError(user, `Error with ${resource_name}History.create: ${e}`);
        throw new BadRequestError(e);
    }
    return {
        id: doc.id,
        created: res.lastErrorObject && !res.lastErrorObject.updatedExisting,
        resource_version: doc.meta.versionId,
    };
};
