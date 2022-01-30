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
const {removeNull} = require('./nullRemover');
const {isTrue} = require('./isTrue');

/**
 * logs an entry for audit
 * @param {import('./requestInfo').RequestInfo} requestInfo
 * @param {string} resourceType
 * @param {string} base_version
 * @param {string} operation
 * @param {Object} args
 * @param {string[]} ids
 */
async function logAuditEntry(requestInfo, base_version, resourceType, operation, args, ids) {
    if (isTrue(env.DISABLE_AUDIT_LOGGING)) {
        return;
    }
    // noinspection JSValidateTypes
    /**
     * mongo db connection
     * @type {import('mongodb').Db}
     */
    let db = globals.get(CLIENT_DB);
    const collection_name = env.INTERNAL_AUDIT_TABLE || 'AuditEvent';
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

    const maxNumberOfIds = env.AUDIT_MAX_NUMBER_OF_IDS ? parseInt(env.AUDIT_MAX_NUMBER_OF_IDS) : 50;
    const document = {
        meta: new Meta({
            versionId: '1',
            lastUpdated: new Date(moment.utc().format('YYYY-MM-DDTHH:mm:ssZ')),
            security: [
                {
                    'system': 'https://www.icanbwell.com/owner',
                    'code': 'bwell'
                },
                {
                    'system': 'https://www.icanbwell.com/access',
                    'code': 'bwell'
                }
            ]
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
                    reference: `Person/${requestInfo.user}`
                },
                altId: requestInfo.scope,
                requestor: true,
                name: requestInfo.user,
                network: {
                    address: requestInfo.remoteIPAddress,
                    type: 2
                }
            }
        ],
        action: operationCodeMapping[`${operation}`],
        entity: ids.slice(0, maxNumberOfIds).map((id, index) => {
            return {
                what: {
                    reference: `${resourceType}/${id}`
                },
                detail: index === 0
                    ? Object.entries(args).filter(([_, value]) => typeof value === 'string').map(([key, value], _) => {
                        return {
                            type: key,
                            valueString: value
                        };
                    }) : null
            };
        })
    };
    let resource = new Resource(document);

    let id = getUuid(resource);

    let doc = removeNull(resource.toJSON());
    Object.assign(doc, {id: id});

    await collection.insertOne(doc);
}

module.exports = {
    logAuditEntry: logAuditEntry
};
