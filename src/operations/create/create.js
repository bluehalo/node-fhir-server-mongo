const {logRequest, logDebug, logError} = require('../common/logging');
const {verifyHasValidScopes, doesResourceHaveAccessTags} = require('../security/scopes');
const {getUuid} = require('../../utils/uid.util');
const env = require('var');
const moment = require('moment-timezone');
const sendToS3 = require('../../utils/aws-s3');
const {validateResource} = require('../../utils/validator.util');
const {NotValidatedError, BadRequestError} = require('../../utils/httpErrors');
const globals = require('../../globals');
const {CLIENT_DB} = require('../../constants');
const {getResource} = require('../common/getResource');
const {getMeta} = require('../common/getMeta');

/**
 * does a FHIR Create (POST)
 * @param {string[]} args
 * @param {string} user
 * @param {string} scope
 * @param {Object} body
 * @param {string} path
 * @param {string} resource_name
 * @param {string} collection_name
 */
module.exports.create = async (args, user, scope, body, path, resource_name, collection_name) => {
    logRequest(user, `${resource_name} >>> create`);

    verifyHasValidScopes(resource_name, 'write', user, scope);

    let resource_incoming = body;

    let {base_version} = args;

    logDebug(user, '--- body ----');
    logDebug(user, JSON.stringify(resource_incoming));
    logDebug(user, '-----------------');
    const uuid = getUuid(resource_incoming);

    if (env.LOG_ALL_SAVES) {
        const currentDate = moment.utc().format('YYYY-MM-DD');
        await sendToS3('logs',
            resource_name,
            resource_incoming,
            currentDate,
            uuid,
            'create'
        );
    }

    if (env.VALIDATE_SCHEMA || args['_validate']) {
        logDebug(user, '--- validate schema ----');
        const operationOutcome = validateResource(resource_incoming, resource_name, path);
        if (operationOutcome && operationOutcome.statusCode === 400) {
            const currentDate = moment.utc().format('YYYY-MM-DD');
            operationOutcome.expression = [
                resource_name + '/' + uuid
            ];
            await sendToS3('validation_failures',
                resource_name,
                resource_incoming,
                currentDate,
                uuid,
                'create');
            await sendToS3('validation_failures',
                'OperationOutcome',
                operationOutcome,
                currentDate,
                uuid,
                'create_failure');
            throw new NotValidatedError(operationOutcome);
        }
        logDebug(user, '-----------------');
    }

    try {
        // Grab an instance of our DB and collection (by version)
        let db = globals.get(CLIENT_DB);
        let collection = db.collection(`${collection_name}_${base_version}`);

        // Get current record
        let Resource = getResource(base_version, resource_name);
        logDebug(user, `Resource: ${Resource}`);
        let resource = new Resource(resource_incoming);
        // noinspection JSUnresolvedFunction
        logDebug(user, `resource: ${resource.toJSON()}`);

        if (env.CHECK_ACCESS_TAG_ON_SAVE === '1') {
            if (!doesResourceHaveAccessTags(resource)) {
                // noinspection ExceptionCaughtLocallyJS
                throw new BadRequestError(new Error('Resource is missing a security access tag with system: https://www.icanbwell.com/access '));
            }
        }

        // If no resource ID was provided, generate one.
        let id = getUuid(resource);
        logDebug(user, `id: ${id}`);

        // Create the resource's metadata
        /**
         * @type {function({Object}): Meta}
         */
        let Meta = getMeta(base_version);
        if (!resource_incoming.meta) {
            resource_incoming.meta = new Meta({
                versionId: '1',
                lastUpdated: moment.utc().format('YYYY-MM-DDTHH:mm:ssZ'),
            });
        } else {
            resource_incoming.meta['versionId'] = '1';
            resource_incoming.meta['lastUpdated'] = moment.utc().format('YYYY-MM-DDTHH:mm:ssZ');
        }

        // Create the document to be inserted into Mongo
        // noinspection JSUnresolvedFunction
        let doc = JSON.parse(JSON.stringify(resource.toJSON()));
        Object.assign(doc, {id: id});

        // Create a clone of the object without the _id parameter before assigning a value to
        // the _id parameter in the original document
        let history_doc = Object.assign({}, doc);
        Object.assign(doc, {_id: id});

        logDebug(user, '---- inserting doc ---');
        logDebug(user, doc);
        logDebug(user, '----------------------');

        // Insert our resource record
        try {
            await collection.insertOne(doc);
        } catch (e) {
            // noinspection ExceptionCaughtLocallyJS
            throw new BadRequestError(e);
        }
        // Save the resource to history
        let history_collection = db.collection(`${collection_name}_${base_version}_History`);

        // Insert our resource record to history but don't assign _id
        await history_collection.insertOne(history_doc);
        return {id: doc.id, resource_version: doc.meta.versionId};
    } catch (e) {
        const currentDate = moment.utc().format('YYYY-MM-DD');
        logError(`Error with creating resource ${resource_name} with id: ${uuid} `, e);

        await sendToS3('errors',
            resource_name,
            resource_incoming,
            currentDate,
            uuid,
            'create');
        throw e;
    }
};
