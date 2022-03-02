const globals = require('../../globals');
const {CLIENT_DB} = require('../../constants');
const env = require('var');
const moment = require('moment-timezone');
const {MongoError} = require('../../utils/mongoErrors');
const {verifyHasValidScopes} = require('../security/scopes');
const {buildR4SearchQuery} = require('../query/r4');
const {buildDstu2SearchQuery} = require('../query/dstu2');
const {buildStu3SearchQuery} = require('../query/stu3');
const {getResource} = require('../common/getResource');
const {logRequest, logDebug, logError} = require('../common/logging');
const {enrich} = require('../../enrich/enrich');
const {findIndexForFields} = require('../../indexes/indexHinter');
const {isTrue} = require('../../utils/isTrue');
const pRetry = require('p-retry');
const {logMessageToSlack} = require('../../utils/slack.logger');
const {removeNull} = require('../../utils/nullRemover');
const {logAuditEntry} = require('../../utils/auditLogger');
const {getSecurityTagsFromScope, getQueryWithSecurityTags} = require('../common/getSecurityTags');
const {VERSIONS} = require('@asymmetrik/node-fhir-server-core').constants;

/**
 * does a FHIR Search
 * @param {import('../../utils/requestInfo').RequestInfo} requestInfo
 * @param {Object} args
 * @param {string} resourceName
 * @param {string} collection_name
 * @return {Resource[] | {entry:{resource: Resource}[]}} array of resources
 */
module.exports.searchOld = async (requestInfo, args, resourceName, collection_name) => {
    const startTime = Date.now();
    const user = requestInfo.user;
    const scope = requestInfo.scope;
    const url = requestInfo.originalUrl;
    logRequest(user, resourceName + ' >>> search' + ' scope:' + scope);
    // logRequest('user: ' + req.user);
    // logRequest('scope: ' + req.authInfo.scope);
    verifyHasValidScopes(resourceName, 'read', user, scope);
    logRequest(user, '---- args ----');
    logRequest(user, JSON.stringify(args));
    logRequest(user, '--------');
    /**
     * @type {string[]}
     */
    let securityTags = getSecurityTagsFromScope(user, scope);
    /**
     * @type {string}
     */
    let {base_version} = args;
    /**
     * @type {import('mongodb').Document}
     */
    let query;

    /**
     * @type {Set}
     */
    let columns;

    // eslint-disable-next-line no-useless-catch
    try {
        if (base_version === VERSIONS['3_0_1']) {
            query = buildStu3SearchQuery(args);
        } else if (base_version === VERSIONS['1_0_2']) {
            query = buildDstu2SearchQuery(args);
        } else {
            ({query, columns} = buildR4SearchQuery(resourceName, args));
        }
    } catch (e) {
        throw e;
    }
    query = getQueryWithSecurityTags(securityTags, query);

    // Grab an instance of our DB and collection
    // noinspection JSValidateTypes
    /**
     * mongo db connection
     * @type {import('mongodb').Db}
     */
    let db = globals.get(CLIENT_DB);
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
     * @type {function(?Object): Resource}
     */
    let Resource = getResource(base_version, resourceName);

    logDebug(user, '---- query ----');
    logDebug(user, JSON.stringify(query));
    logDebug(user, '--------');

    /**
     * @type {import('mongodb').FindOneOptions}
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
                    columns.add(property);
                }
                // this is a hack for the CQL Evaluator since it does not request these fields but expects them
                if (resourceName === 'Library') {
                    projection['id'] = 1;
                    projection['url'] = 1;
                }
                // also exclude _id so if there is a covering index the query can be satisfied from the covering index
                projection['_id'] = 0;
                options['projection'] = projection;
            }
        }
        // if _sort is specified then add sort criteria to mongo query
        if (args['_sort']) {
            // GET [base]/Observation?_sort=status,-date,category
            // Each item in the comma separated list is a search parameter, optionally with a '-' prefix.
            // The prefix indicates decreasing order; in its absence, the parameter is applied in increasing order.
            /**
             * @type {string[]}
             */
            const sort_properties_list = Array.isArray(args['_sort']) ? args['_sort'] : args['_sort'].split(',');
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
                        columns.add(sortPropertyWithoutMinus);
                    } else {
                        sort[`${sortProperty}`] = 1;
                        columns.add(sortProperty);
                    }
                }
                options['sort'] = sort;
            }
        }

        // if _count is specified then limit mongo query to that
        if (args['_count']) {
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

        // for consistency in results while paging, always sort by id
        // https://docs.mongodb.com/manual/reference/method/cursor.sort/#sort-cursor-consistent-sorting
        const defaultSortId = env.DEFAULT_SORT_ID || 'id';
        columns.add(defaultSortId);
        if (!('sort' in options)) {
            options['sort'] = {};
        }
        // add id to end if not present in sort
        if (!(`${defaultSortId}` in options['sort'])) {
            options['sort'][`${defaultSortId}`] = 1;
        }

        // Now run the query to get a cursor we will enumerate next
        let cursorQuery = collection.find(query, options).maxTimeMS(maxMongoTimeMS);

        /**
         * @type {int | null}
         */
        let cursorBatchSize = null;
        // set batch size if specified
        if (env.MONGO_BATCH_SIZE || args['_cursorBatchSize']) {
            cursorBatchSize = args['_cursorBatchSize'] ? parseInt(args['_cursorBatchSize']) : parseInt(env.MONGO_BATCH_SIZE);
            if (cursorBatchSize > 0) {
                cursorQuery = cursorQuery.batchSize(cursorBatchSize);
            }
        }
        /**
         * mongo db cursor
         * @type {Promise<Cursor<unknown>> | *}
         */
        let cursor = await pRetry(
            async () =>
                await cursorQuery,
            {
                retries: 5,
                onFailedAttempt: async error => {
                    let msg = `Search ${resourceName}/${JSON.stringify(args)} Retry Number: ${error.attemptNumber}: ${error.message}`;
                    logError(user, msg);
                    await logMessageToSlack(msg);
                }
            }
        );

        // find columns being queried and match them to an index
        /**
         * which index hint to use (if any)
         * @type {string|null}
         */
        let indexHint = null;
        if (isTrue(env.SET_INDEX_HINTS) || args['_setIndexHint']) {
            indexHint = findIndexForFields(mongoCollectionName, Array.from(columns));
            if (indexHint) {
                cursor = cursor.hint(indexHint);
                logDebug(user, `Using index hint ${indexHint} for columns [${Array.from(columns).join(',')}]`);
            }
        }

        // if _total is specified then ask mongo for the total else set total to 0
        let total_count = 0;
        if (args['_total'] && (['accurate', 'estimate'].includes(args['_total']))) {
            // https://www.hl7.org/fhir/search.html#total
            // if _total is passed then calculate the total count for matching records also
            // don't use the options since they set a limit and skip
            if (args['_total'] === 'estimate') {
                total_count = await collection.estimatedDocumentCount(query, {maxTimeMS: maxMongoTimeMS});
            } else {
                total_count = await collection.countDocuments(query, {maxTimeMS: maxMongoTimeMS});
            }
        }
        // Resource is a resource cursor, pull documents out before resolving
        /**
         * resources to return
         * @type {Resource[]}
         */
        let resources = [];
        while (await cursor.hasNext()) {
            /**
             * element
             * @type {Resource}
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
                // this is a hack for the CQL Evaluator since it does not request these fields but expects them
                if (resourceName === 'Library') {
                    element_to_return['id'] = element['id'];
                    element_to_return['url'] = element['url'];
                }

                resources.push(element_to_return);
            } else {
                resources.push(new Resource(element));
            }
        }

        // remove any nulls or empty objects or arrays
        resources = resources.map(r => removeNull(r.toJSON()));

        // run any enrichment
        resources = await enrich(resources, resourceName);

        if (resources.length > 0) {
            // log access to audit logs
            await logAuditEntry(requestInfo, base_version, resourceName, 'read', args, resources.map(r => r['id']));
        }

        const stopTime = Date.now();

        // if env.RETURN_BUNDLE is set then return as a Bundle
        if (env.RETURN_BUNDLE || args['_bundle']) {
            /**
             * array of links
             * @type {[{relation:string, url: string}]}
             */
            let link = [];
            // find id of last resource
            if (url) {

                /**
                 * id of last resource in the list
                 * @type {?number}
                 */
                const last_id = resources.length > 0 ? resources[resources.length - 1].id : null;
                if (last_id) {
                    // have to use a base url or URL() errors
                    const baseUrl = 'https://example.org';
                    /**
                     * url to get next page
                     * @type {URL}
                     */
                    const nextUrl = new URL(url, baseUrl);
                    // add or update the id:above param
                    nextUrl.searchParams.set('id:above', `${last_id}`);
                    // remove the _getpagesoffset param since that will skip again from this id
                    nextUrl.searchParams.delete('_getpagesoffset');
                    link = [
                        {
                            'relation': 'self',
                            'url': `${url}`
                        },
                        {
                            'relation': 'next',
                            'url': `${nextUrl.toString().replace(baseUrl, '')}`
                        }
                    ];
                } else {
                    link = [
                        {
                            'relation': 'self',
                            'url': `${url}`
                        }
                    ];
                }
            }
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
            const bundle = new Bundle({
                type: 'searchset',
                timestamp: moment.utc().format('YYYY-MM-DDThh:mm:ss.sss') + 'Z',
                entry: entries,
                total: total_count,
                link: link
            });
            if (args['_debug'] || (env.LOGLEVEL === 'DEBUG')) {
                const tag = [
                    {
                        system: 'https://www.icanbwell.com/queryIndexHint',
                        code: indexHint
                    },
                    {
                        system: 'https://www.icanbwell.com/query',
                        display: JSON.stringify(query)
                    },
                    {
                        system: 'https://www.icanbwell.com/queryCollection',
                        code: mongoCollectionName
                    },
                    {
                        system: 'https://www.icanbwell.com/queryOptions',
                        display: options ? JSON.stringify(options) : null
                    },
                    {
                        system: 'https://www.icanbwell.com/queryFields',
                        display: columns ? JSON.stringify(Array.from(columns)) : null
                    },
                    {
                        system: 'https://www.icanbwell.com/queryTime',
                        display: `${(stopTime - startTime) / 1000}`
                    }
                ];
                if (cursorBatchSize !== null && cursorBatchSize > 0) {
                    tag.push(
                        {
                            system: 'https://www.icanbwell.com/queryCursorBatchSize',
                            display: `${cursorBatchSize}`
                        }
                    );
                }
                bundle['meta'] = {
                    tag: tag
                };
                logDebug(user, JSON.stringify(bundle));
            }
            return bundle;
        } else {
            return resources;
        }
    } catch
        (e) {
        throw new MongoError(e.message, e, mongoCollectionName, query, options);
    }
};