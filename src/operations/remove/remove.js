const {logRequest, logError} = require('../common/logging');
const {verifyHasValidScopes, getAccessCodesFromScopes} = require('../security/scopes');
const globals = require('../../globals');
const {CLIENT_DB} = require('../../constants');
const {NotAllowedError, ForbiddenError} = require('../../utils/httpErrors');
const env = require('var');
const {buildStu3SearchQuery} = require('../query/stu3');
const {buildDstu2SearchQuery} = require('../query/dstu2');
const {buildR4SearchQuery} = require('../query/r4');
const {logAuditEntry} = require('../../utils/auditLogger');
const {VERSIONS} = require('@asymmetrik/node-fhir-server-core').constants;
/**
 * does a FHIR Remove (DELETE)
 * @param {import('../../utils/requestInfo').RequestInfo} requestInfo
 * @param {Object} args
 * @param {string} resourceName
 * @param {string} collection_name
 */
// eslint-disable-next-line no-unused-vars
module.exports.remove = async (requestInfo, args, resourceName, collection_name) => {
    const user = requestInfo.user;
    const scope = requestInfo.scope;

    logRequest(user, `${resourceName} >>> remove`);

    if (args['id'] === '0') {
        delete args['id'];
    }

    /**
     * @type {string[]}
     */
    let securityTags = [];
    // add any access codes from scopes
    const accessCodes = getAccessCodesFromScopes('read', user, scope);
    if (env.AUTH_ENABLED === '1') {
        // fail if there are no access codes
        if (accessCodes.length === 0) {
            let errorMessage = 'user ' + user + ' with scopes [' + scope + '] has no access scopes';
            throw new ForbiddenError(errorMessage);
        }
        // see if we have the * access code
        else if (accessCodes.includes('*')) {
            // no security check since user has full access to everything
        } else {
            securityTags = accessCodes;
        }
    }
    verifyHasValidScopes(resourceName, 'write', user, scope);

    let {base_version} = args;
    /**
     * @type {import('mongodb').Document}
     */
    let query = {};

    // eslint-disable-next-line no-useless-catch
    try {
        if (base_version === VERSIONS['3_0_1']) {
            query = buildStu3SearchQuery(args);
        } else if (base_version === VERSIONS['1_0_2']) {
            query = buildDstu2SearchQuery(args);
        } else {
            ({query} = buildR4SearchQuery(resourceName, args));
        }
    } catch (e) {
        throw e;
    }

    // add in $and statements for security tags
    if (securityTags && securityTags.length > 0) {
        // add as a separate $and statement
        if (query.$and === undefined) {
            query.$and = [];
        }
        query.$and.push(
            {
                'meta.security': {
                    '$elemMatch': {
                        'system': 'https://www.icanbwell.com/access',
                        'code': {
                            '$in': securityTags
                        }
                    }
                }
            }
        );
    }

    logRequest(user, `Deleting ${JSON.stringify(query)}`);

    if (Object.keys(query).length === 0) {
        // don't delete everything
        return {deleted: 0};
    }

    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(`${collection_name}_${base_version}`);
    // Delete our resource record
    let res;
    try {
        res = await collection.deleteMany(query);

        // log access to audit logs
        await logAuditEntry(requestInfo, base_version, resourceName, 'delete', args, []);

    } catch (e) {
        logError(user, `Error with ${resourceName}.remove`);
        throw new NotAllowedError(e.message);
    }

    return {deleted: res.deletedCount};
};
