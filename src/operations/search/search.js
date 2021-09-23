const {ForbiddenError} = require('../../utils/httpErrors');
const globals = require('../../globals');
const {CLIENT_DB} = require('../../constants');
const env = require('var');
const moment = require('moment-timezone');
const {MongoError} = require('../../utils/mongoErrors');
const {verifyHasValidScopes, getAccessCodesFromScopes} = require('../security/scopes');
const {buildR4SearchQuery} = require('./query/r4');
const {buildDstu2SearchQuery} = require('./query/dstu2');
const {buildStu3SearchQuery} = require('./query/stu3');
const {getResource} = require('../common/getResource');
const {logRequest, logDebug} = require('../common/logging');
const {VERSIONS} = require('@asymmetrik/node-fhir-server-core').constants;

/**
 * does a FHIR Search
 * @param {string[]} args
 * @param {string} user
 * @param {string} scope
 * @param {string} resource_name
 * @param {string} collection_name
 * @return {Resource[] | Resource} array of resources
 */
module.exports.search = async (args, user, scope, resource_name, collection_name) => {
    logRequest(user, resource_name + ' >>> search' + ' scope:' + scope);
    // logRequest('user: ' + req.user);
    // logRequest('scope: ' + req.authInfo.scope);
    verifyHasValidScopes(resource_name, 'read', user, scope);
    logRequest(user, '---- args ----');
    logRequest(user, JSON.stringify(args));
    logRequest(user, '--------');

    // add any access codes from scopes
    const accessCodes = getAccessCodesFromScopes('read', user, scope);
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
    /**
     * @type {string}
     */
    let {base_version} = args;
    /**
     * @type {import('mongodb').Document}
     */
    let query;

    if (base_version === VERSIONS['3_0_1']) {
        query = buildStu3SearchQuery(args);
    } else if (base_version === VERSIONS['1_0_2']) {
        query = buildDstu2SearchQuery(args);
    } else {
        query = buildR4SearchQuery(resource_name, args);
    }

    // Grab an instance of our DB and collection
    /**
     * mongo db connection
     * @type {import('mongodb').Db}
     */
    let db = globals.get(CLIENT_DB);
    /**
     * mongo collection
     * @type {import('mongodb').Collection}
     */
    let collection = db.collection(`${collection_name}_${base_version}`);
    /**
     * @type {function(?Object): Resource}
     */
    let Resource = getResource(base_version, resource_name);

    logDebug(user, '---- query ----');
    logDebug(user, query);
    logDebug(user, '--------');

    /**
     * @type {import('mongodb').FindOptions}
     */
    let options = {};

    // Query our collection for this observation
    /**
     * @type {number}
     */
    const maxMongoTimeMS = env.MONGO_TIMEOUT ? parseInt(env.MONGO_TIMEOUT) : (30 * 1000);

    try {
        // if _elements=x,y,z is in url parameters then restrict mongo query to project only those fields
        if (args['_elements']) {
            // GET [base]/Observation?_elements=status,date,category
            /**
             * @type {string}
             */
            const properties_to_return_as_csv = args['_elements'];
            /**
             * @type {string[]}
             */
            const properties_to_return_list = properties_to_return_as_csv.split(',');
            if (properties_to_return_list.length > 0) {
                /**
                 * @type {import('mongodb').Document}
                 */
                const projection = {};
                for (const property of properties_to_return_list) {
                    projection[`${property}`] = 1;
                }
                options['projection'] = projection;
            }
        }
        // if _sort is specified then add sort criteria to mongo query
        if (args['_sort']) {
            // GET [base]/Observation?_sort=status,-date,category
            // Each item in the comma separated list is a search parameter, optionally with a '-' prefix.
            // The prefix indicates decreasing order; in its absence, the parameter is applied in increasing order.
            /**
             * @type {string}
             */
            const sort_properties_as_csv = args['_sort'];
            /**
             * @type {string[]}
             */
            const sort_properties_list = sort_properties_as_csv.split(',');
            if (sort_properties_list.length > 0) {
                /**
                 * @type {import('mongodb').Sort}
                 */
                const sort = {};
                /**
                 * @type {string}
                 */
                for (const sortProperty of sort_properties_list) {
                    if (sortProperty.startsWith('-')) {
                        /**
                         * @type {string}
                         */
                        const sortPropertyWithoutMinus = sortProperty.substring(1);
                        sort[`${sortPropertyWithoutMinus}`] = -1;
                    } else {
                        sort[`${sortProperty}`] = 1;
                    }
                }
                options['sort'] = sort;
            }
        }

        // if _count is specified then limit mongo query to that
        if (args['_count']) {
            if (!('sort' in options)) {
                // for consistency in results while paging, always sort by _id
                // https://docs.mongodb.com/manual/reference/method/cursor.sort/#sort-cursor-consistent-sorting
                options['sort'] = {'_id': 1};
            }
            /**
             * @type {number}
             */
            const nPerPage = Number(args['_count']);

            // if _getpagesoffset is specified then skip to the page starting with that offset
            if (args['_getpagesoffset']) {
                /**
                 * @type {number}
                 */
                const pageNumber = Number(args['_getpagesoffset']);
                options['skip'] = pageNumber > 0 ? (pageNumber * nPerPage) : 0;
            }
            options['limit'] = nPerPage;
        } else {
            if (!args['id'] && !args['_elements']) {
                // set a limit so the server does not come down due to volume of data
                options['limit'] = 10;
            }
        }

        // Now run the query to get a cursor we will enumerate next
        /**
         * mongo db cursor
         * @type {import('mongodb').FindCursor}
         */
        let cursor = await collection.find(query, options).maxTimeMS(maxMongoTimeMS);

        // if _total is specified then ask mongo for the total else set total to 0
        let total_count = 0;
        if (args['_total'] && (['accurate', 'estimate'].includes(args['_total']))) {
            // https://www.hl7.org/fhir/search.html#total
            // if _total is passed then calculate the total count for matching records also
            // don't use the options since they set a limit and skip
            total_count = await collection.countDocuments(query, {maxTimeMS: maxMongoTimeMS});
        }
        // Resource is a resource cursor, pull documents out before resolving
        /**
         * resources to return
         * @type {Resource[]}
         */
        const resources = [];
        while (await cursor.hasNext()) {
            /**
             * element
             * @type {Object}
             */
            const element = await cursor.next();
            if (args['_elements']) {
                /**
                 * @type {string}
                 */
                const properties_to_return_as_csv = args['_elements'];
                /**
                 * @type {string[]}
                 */
                const properties_to_return_list = properties_to_return_as_csv.split(',');
                /**
                 * @type {Resource}
                 */
                const element_to_return = new Resource(null);
                /**
                 * @type {string}
                 */
                for (const property of properties_to_return_list) {
                    if (property in element_to_return) {
                        element_to_return[`${property}`] = element[`${property}`];
                    }
                }
                resources.push(element_to_return);
            } else {
                resources.push(new Resource(element));
            }
        }

        // if env.RETURN_BUNDLE is set then return as a Bundle
        if (env.RETURN_BUNDLE || args['_bundle']) {
            /**
             * @type {function({Object}):Resource}
             */
            const Bundle = getResource(base_version, 'bundle');
            /**
             * @type {{resource: Resource}[]}
             */
            const entries = resources.map(resource => {
                return {resource: resource};
            });
            return new Bundle({
                type: 'searchset',
                timestamp: moment.utc().format('YYYY-MM-DDThh:mm:ss.sss') + 'Z',
                entry: entries,
                total: total_count
            });
        } else {
            return resources;
        }
    } catch (e) {
        throw new MongoError(e.message, e, collection_name, query, options);
    }
};
