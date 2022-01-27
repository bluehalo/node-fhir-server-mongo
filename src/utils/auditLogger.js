/**
 * logs audit entries
 */
const globals = require('../globals');
const {CLIENT_DB} = require('../constants');
const env = require('var');
const moment = require('moment-timezone');
const {getMeta} = require('../operations/common/getMeta');
const {getResource} = require('../operations/common/getResource');
const {getUuid} = require('./uid.util');
const {logDebug} = require('../operations/common/logging');
const {removeNull} = require('./nullRemover');

/**
 * logs an entry for audit
 * @param {string} user
 * @param {string} resourceType
 * @param {string} base_version
 * @param {string} operation
 * @param {string[]} ids
 */
async function logAuditEntry(user, base_version, resourceType, operation, ids) {
    // noinspection JSValidateTypes
    /**
     * mongo db connection
     * @type {import('mongodb').Db}
     */
    let db = globals.get(CLIENT_DB);
    const collection_name = env.INTERNAL_AUDIT_TABLE || 'InternalAuditEvent';
    /**
     * @type {string}
     */
    const mongoCollectionName = `${collection_name}_${base_version}`;
    /**
     * mongo collection
     * @type {import('mongodb').Collection}
     */
    let collection = db.collection(mongoCollectionName);

    /**
     * @type {function({Object}): Meta}
     */
    let Meta = getMeta(base_version);

    const operationCodeMapping = {
        'create': 'C',
        'read': 'R',
        'update': 'U',
        'delete': 'D',
        'execute': 'E'
    };

    // Get current record
    let Resource = getResource(base_version, 'AuditEvent');

    const document = {
        meta: new Meta({
            versionId: '1',
            lastUpdated: new Date(moment.utc().format('YYYY-MM-DDTHH:mm:ssZ')),
        }),
        recorded: new Date(moment.utc().format('YYYY-MM-DDTHH:mm:ssZ')),
        type: {
            system: 'http://dicom.nema.org/resources/ontology/DCM',
            code: 110112,
            display: 'Query'
        },
        agent: [
            {
                who: {
                    reference: `Person/${user}`
                },
                requestor: true
            }
        ],
        action: operationCodeMapping[`${operation}`],
        entity: ids.map(id => {
            return {
                what: {
                    reference: `${resourceType}/${id}`
                }
            };
        })
    };
    let resource = new Resource(document);

    let id = getUuid(resource);
    logDebug(user, `id: ${id}`);

    let doc = removeNull(resource.toJSON());
    Object.assign(doc, {id: id});

    await collection.insertOne(doc);
}

module.exports = {
    logAuditEntry: logAuditEntry
};
