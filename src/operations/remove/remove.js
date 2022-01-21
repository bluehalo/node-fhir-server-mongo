const {logRequest, logError} = require('../common/logging');
const {verifyHasValidScopes, getAccessCodesFromScopes} = require('../security/scopes');
const globals = require('../../globals');
const {CLIENT_DB} = require('../../constants');
const {NotAllowedError, ForbiddenError} = require('../../utils/httpErrors');
const env = require('var');
const {buildStu3SearchQuery} = require('../query/stu3');
const {buildDstu2SearchQuery} = require('../query/dstu2');
const {buildR4SearchQuery} = require('../query/r4');
const {VERSIONS} = require('@asymmetrik/node-fhir-server-core').constants;
/**
 * does a FHIR Remove (DELETE)
 * @param {Object} args
 * @param {string} user
 * @param {string} scope
 * @param {string} resourceName
 * @param {string} collection_name
 */
// eslint-disable-next-line no-unused-vars
module.exports.remove = async (args, user, scope, resourceName, collection_name) => {
    logRequest(user, `${resourceName} >>> remove`);

    if (args['id'] === '0') {
        delete args['id'];
    }

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
            /**
             * @type {string}
             */
            for (const accessCode of accessCodes) {
                if (args['_security']) {
                    args['_security'] = args['_security'] + ',' + accessCode;
                } else {
                    args['_security'] = 'https://www.icanbwell.com/access|' + accessCode;
                }
            }
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
    } catch (e) {
        logError(user, `Error with ${resourceName}.remove`);
        throw new NotAllowedError(e.message);
    }

    return {deleted: res.deletedCount};
};
