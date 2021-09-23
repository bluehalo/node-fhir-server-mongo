const {logRequest, logDebug} = require('../common/logging');
const {
    parseScopes,
    verifyHasValidScopes,
    doesResourceHaveAccessTags,
    isAccessToResourceAllowedBySecurityTags
} = require('../security/scopes');
const moment = require('moment-timezone');
const {isTrue} = require('../common/isTrue');
const env = require('var');
const scopeChecker = require('@asymmetrik/sof-scope-checker');
const {validateResource} = require('../../utils/validator.util');
const sendToS3 = require('../../utils/aws-s3');
const globals = require('../../globals');
const {CLIENT_DB} = require('../../constants');
const {getResource} = require('../common/getResource');
const deepcopy = require('deepcopy');
const deepEqual = require('fast-deep-equal');
const deepmerge = require('deepmerge');
const {compare, applyPatch} = require('fast-json-patch');
const {ForbiddenError, BadRequestError} = require('../../utils/httpErrors');
const {getMeta} = require('../common/getMeta');
const async = require('async');
const {check_fhir_mismatch} = require('../common/check_fhir_mismatch');
const {logError} = require('../common/logging');

/**
 * does a FHIR Merge
 * @param {string[]} args
 * @param {string} user
 * @param {string} scope
 * @param {Object[]} body
 * @param {string} path
 * @param {string} resource_name
 * @param {string} collection_name
 * @return {Resource | Resource[]}
 */
module.exports.merge = async (args, user, scope, body, path, resource_name, collection_name) => {
    /**
     * @type {string}
     */
    logRequest(user, `'${resource_name} >>> merge` + ' scopes:' + scope);

    /**
     * @type {string[]}
     */
    const scopes = parseScopes(scope);

    verifyHasValidScopes(resource_name, 'write', user, scope);

    // read the incoming resource from request body
    /**
     * @type {Object[]}
     */
    let resources_incoming = body;
    logDebug(user, JSON.stringify(args));
    /**
     * @type {String}
     */
    let {base_version} = args;

    // logDebug('--- request ----');
    // logDebug(req);
    // logDebug('-----------------');

    // Assign a random number to this batch request
    /**
     * @type {string}
     */
    const requestId = Math.random().toString(36).substring(0, 5);
    /**
     * @type {string}
     */
    const currentDate = moment.utc().format('YYYY-MM-DD');

    logDebug(user, '--- body ----');
    logDebug(user, JSON.stringify(resources_incoming));
    logDebug(user, '-----------------');

    async function preMergeChecks(resourceToMerge) {
        let id = resourceToMerge.id;
        if (!(resourceToMerge.resourceType)) {
            /**
             * @type {OperationOutcome}
             */
            const operationOutcome = {
                resourceType: 'OperationOutcome',
                issue: [
                    {
                        severity: 'error',
                        code: 'exception',
                        details: {
                            text: 'Error merging: ' + JSON.stringify(resourceToMerge)
                        },
                        diagnostics: 'resource is missing resourceType',
                        expression: [
                            resource_name + '/' + id
                        ]
                    }
                ]
            };
            return {
                id: id,
                created: false,
                updated: false,
                issue: (operationOutcome.issue && operationOutcome.issue.length > 0) ? operationOutcome.issue[0] : null,
                operationOutcome: operationOutcome
            };
        }

        if (isTrue(env.AUTH_ENABLED)) {
            let {success} = scopeChecker(resourceToMerge.resourceType, 'write', scopes);
            if (!success) {
                const operationOutcome = {
                    resourceType: 'OperationOutcome',
                    issue: [
                        {
                            severity: 'error',
                            code: 'exception',
                            details: {
                                text: 'Error merging: ' + JSON.stringify(resourceToMerge)
                            },
                            diagnostics: 'user ' + user + ' with scopes [' + scopes + '] failed access check to [' + resourceToMerge.resourceType + '.' + 'write' + ']',
                            expression: [
                                resourceToMerge.resourceType + '/' + id
                            ]
                        }
                    ]
                };
                return {
                    id: id,
                    created: false,
                    updated: false,
                    issue: (operationOutcome.issue && operationOutcome.issue.length > 0) ? operationOutcome.issue[0] : null,
                    operationOutcome: operationOutcome
                };
            }
        }

        if (env.VALIDATE_SCHEMA || args['_validate']) {
            logDebug(user, '--- validate schema ----');
            /**
             * @type {?OperationOutcome}
             */
            const operationOutcome = validateResource(resourceToMerge, resourceToMerge.resourceType, path);
            if (operationOutcome && operationOutcome.statusCode === 400) {
                operationOutcome['expression'] = [
                    resourceToMerge.resourceType + '/' + id
                ];
                if (!(operationOutcome['details']) || !(operationOutcome['details']['text'])) {
                    operationOutcome['details'] = {
                        text: ''
                    };
                }
                operationOutcome['details']['text'] = operationOutcome['details']['text'] + ',' + JSON.stringify(resourceToMerge);

                await sendToS3('validation_failures',
                    resourceToMerge.resourceType,
                    resourceToMerge,
                    currentDate,
                    id,
                    'merge');
                await sendToS3('validation_failures',
                    resourceToMerge.resourceType,
                    operationOutcome,
                    currentDate,
                    id,
                    'merge_failure');
                return {
                    id: id,
                    created: false,
                    updated: false,
                    issue: (operationOutcome.issue && operationOutcome.issue.length > 0) ? operationOutcome.issue[0] : null,
                    operationOutcome: operationOutcome
                };
            }
            logDebug(user, '-----------------');
        }

        if (env.CHECK_ACCESS_TAG_ON_SAVE === '1') {
            if (!doesResourceHaveAccessTags(resourceToMerge)) {
                const operationOutcome = {
                    resourceType: 'OperationOutcome',
                    issue: [
                        {
                            severity: 'error',
                            code: 'exception',
                            details: {
                                text: 'Error merging: ' + JSON.stringify(resourceToMerge)
                            },
                            diagnostics: 'Resource is missing a meta.security tag with system: https://www.icanbwell.com/access',
                            expression: [
                                resourceToMerge.resourceType + '/' + id
                            ]
                        }
                    ]
                };
                return {
                    id: id,
                    created: false,
                    updated: false,
                    issue: (operationOutcome.issue && operationOutcome.issue.length > 0) ? operationOutcome.issue[0] : null,
                    operationOutcome: operationOutcome
                };
            }
        }

        return false;
    }

    async function performMergeDbUpdate(resourceToMerge, doc, cleaned) {
        let id = resourceToMerge.id;
        /**
         * @type {import('mongodb').Db}
         */
        let db = globals.get(CLIENT_DB);
        /**
         * @type {import('mongodb').Collection}
         */
        let collection = db.collection(`${resourceToMerge.resourceType}_${base_version}`);
        // Insert/update our resource record
        // When using the $set operator, only the specified fields are updated
        /**
         * @type {Object}
         */
        let res = await collection.findOneAndUpdate({id: id.toString()}, {$set: doc}, {upsert: true});

        // save to history
        /**
         * @type {import('mongodb').Collection}
         */
        let history_collection = db.collection(`${collection_name}_${base_version}_History`);
        /**
         * @type {import('mongodb').Document}
         */
        let history_resource = Object.assign(cleaned, {_id: id + cleaned.meta.versionId});
        /**
         * @type {boolean}
         */
        const created_entity = res.lastErrorObject && !res.lastErrorObject.updatedExisting;
        // Insert our resource record to history but don't assign _id
        delete history_resource['_id']; // make sure we don't have an _id field when inserting into history
        await history_collection.insertOne(history_resource);
        return {
            id: id,
            created: created_entity,
            updated: res.lastErrorObject.updatedExisting,
            resource_version: doc.meta.versionId
        };
    }

    async function mergeExisting(resourceToMerge, data) {
        let id = resourceToMerge.id;
        // create a resource with incoming data
        /**
         * @type {function({Object}):Resource}
         */
        let Resource = getResource(base_version, resourceToMerge.resourceType);

        // found an existing resource
        logDebug(user, resourceToMerge.resourceType + ': merge found resource ' + '[' + data.id + ']: ' + JSON.stringify(data));
        /**
         * @type {Resource}
         */
        let foundResource = new Resource(data);
        logDebug(user, '------ found document --------');
        logDebug(user, data);
        logDebug(user, '------ end found document --------');
        // use metadata of existing resource (overwrite any passed in metadata)
        if (!resourceToMerge.meta) {
            resourceToMerge.meta = {};
        }
        // compare without checking source so we don't create a new version just because of a difference in source
        /**
         * @type {string}
         */
        const original_source = resourceToMerge.meta.source;
        resourceToMerge.meta.versionId = foundResource.meta.versionId;
        resourceToMerge.meta.lastUpdated = foundResource.meta.lastUpdated;
        resourceToMerge.meta.source = foundResource.meta.source;
        logDebug(user, '------ incoming document --------');
        logDebug(user, resourceToMerge);
        logDebug(user, '------ end incoming document --------');

        /**
         * @type {Object}
         */
        const my_data = deepcopy(data);
        delete my_data['_id']; // remove _id since that is an internal

        // for speed, first check if the incoming resource is exactly the same
        if (deepEqual(my_data, resourceToMerge) === true) {
            logDebug(user, 'No changes detected in updated resource');
            return {
                id: id,
                created: false,
                updated: false,
                resource_version: foundResource.meta.versionId,
                message: 'No changes detected in updated resource'
            };
        }

        let mergeObjectOrArray;

        /**
         * @type {{customMerge: (function(*): *)}}
         */
            // noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols
        const options = {
                // eslint-disable-next-line no-unused-vars
                customMerge: (/*key*/) => {
                    return mergeObjectOrArray;
                }
            };

        /**
         * @param {?Object | Object[]} oldItem
         * @param {?Object | Object[]} newItem
         * @return {?Object | Object[]}
         */
        mergeObjectOrArray = (oldItem, newItem) => {
            if (deepEqual(oldItem, newItem)) {
                return oldItem;
            }
            if (Array.isArray(oldItem)) {
                /**
                 * @type {? Object[]}
                 */
                let result_array = null;
                // iterate through all the new array and find any items that are not present in old array
                for (let i = 0; i < newItem.length; i++) {
                    /**
                     * @type {Object}
                     */
                    let my_item = newItem[`${i}`];

                    if (my_item === null) {
                        continue;
                    }

                    // if newItem[i] does not matches any item in oldItem then insert
                    if (oldItem.every(a => deepEqual(a, my_item) === false)) {
                        if (typeof my_item === 'object' && 'id' in my_item) {
                            // find item in oldItem array that matches this one by id
                            /**
                             * @type {number}
                             */
                            const matchingOldItemIndex = oldItem.findIndex(x => x['id'] === my_item['id']);
                            if (matchingOldItemIndex > -1) {
                                // check if id column exists and is the same
                                //  then recurse down and merge that item
                                if (result_array === null) {
                                    result_array = deepcopy(oldItem); // deep copy so we don't change the original object
                                }
                                result_array[`${matchingOldItemIndex}`] = deepmerge(oldItem[`${matchingOldItemIndex}`], my_item, options);
                                continue;
                            }
                        }
                        // insert based on sequence if present
                        if (typeof my_item === 'object' && 'sequence' in my_item) {
                            /**
                             * @type {Object[]}
                             */
                            result_array = [];
                            // go through the list until you find a sequence number that is greater than the new
                            // item and then insert before it
                            /**
                             * @type {number}
                             */
                            let index = 0;
                            /**
                             * @type {boolean}
                             */
                            let insertedItem = false;
                            while (index < oldItem.length) {
                                /**
                                 * @type {Object}
                                 */
                                const element = oldItem[`${index}`];
                                // if item has not already been inserted then insert before the next sequence
                                if (!insertedItem && (element['sequence'] > my_item['sequence'])) {
                                    result_array.push(my_item); // add the new item before
                                    result_array.push(element); // then add the old item
                                    insertedItem = true;
                                } else {
                                    result_array.push(element); // just add the old item
                                }
                                index += 1;
                            }
                            if (!insertedItem) {
                                // if no sequence number greater than this was found then add at the end
                                result_array.push(my_item);
                            }
                        } else {
                            // no sequence property is set on this item so just insert at the end
                            if (result_array === null) {
                                result_array = deepcopy(oldItem); // deep copy so we don't change the original object
                            }
                            result_array.push(my_item);
                        }
                    }
                }
                if (result_array !== null) {
                    return result_array;
                } else {
                    return oldItem;
                }
            }
            return deepmerge(oldItem, newItem, options);
        };

        // data seems to get updated below
        /**
         * @type {Object}
         */
        let resource_merged = deepmerge(data, resourceToMerge, options);

        // now create a patch between the document in db and the incoming document
        //  this returns an array of patches
        /**
         * @type {Operation[]}
         */
        let patchContent = compare(data, resource_merged);
        // ignore any changes to _id since that's an internal field
        patchContent = patchContent.filter(item => item.path !== '/_id');
        logDebug(user, '------ patches --------');
        logDebug(user, patchContent);
        logDebug(user, '------ end patches --------');
        // see if there are any changes
        if (patchContent.length === 0) {
            logDebug(user, 'No changes detected in updated resource');
            return {
                id: id,
                created: false,
                updated: false,
                resource_version: foundResource.meta.versionId,
                message: 'No changes detected in updated resource'
            };
        }
        if (!(isAccessToResourceAllowedBySecurityTags(foundResource, user, scope))) {
            throw new ForbiddenError(
                'user ' + user + ' with scopes [' + scope + '] has no access to resource ' +
                foundResource.resourceType + ' with id ' + id);
        }
        logRequest(user, `${resourceToMerge.resourceType} >>> merging ${id}`);
        // now apply the patches to the found resource
        // noinspection JSCheckFunctionSignatures
        /**
         * @type {Object}
         */
        let patched_incoming_data = applyPatch(data, patchContent).newDocument;
        /**
         * @type {Object}
         */
        let patched_resource_incoming = new Resource(patched_incoming_data);
        // update the metadata to increment versionId
        /**
         * @type {{versionId: string, lastUpdated: string, source: string}}
         */
        let meta = foundResource.meta;
        meta.versionId = `${parseInt(foundResource.meta.versionId) + 1}`;
        meta.lastUpdated = moment.utc().format('YYYY-MM-DDTHH:mm:ssZ');
        // set the source from the incoming resource
        meta.source = original_source;
        // These properties are set automatically
        patched_resource_incoming.meta.versionId = meta.versionId;
        patched_resource_incoming.meta.lastUpdated = meta.lastUpdated;
        // If not source is provided then use the source of the previous entity
        if (!(patched_resource_incoming.meta.source)) {
            patched_resource_incoming.meta.source = meta.source;
        }
        // If no security tags are provided then use the source of the previous entity
        if (!(patched_resource_incoming.meta.security)) {
            patched_resource_incoming.meta.security = meta.security;
        }
        logDebug(user, '------ patched document --------');
        logDebug(user, patched_resource_incoming);
        logDebug(user, '------ end patched document --------');
        // Same as update from this point on
        const cleaned = JSON.parse(JSON.stringify(patched_resource_incoming));
        check_fhir_mismatch(cleaned, patched_incoming_data);
        const doc = Object.assign(cleaned, {_id: id});
        if (env.LOG_ALL_MERGES) {
            await sendToS3('logs',
                resourceToMerge.resourceType,
                {
                    'old': data,
                    'new': resourceToMerge,
                    'patch': patchContent,
                    'after': doc
                },
                currentDate,
                id,
                'merge_' + meta.versionId + '_' + requestId);
        }
        return await performMergeDbUpdate(resourceToMerge, doc, cleaned);
    }

    async function mergeInsert(resourceToMerge) {
        let id = resourceToMerge.id;
        // not found so insert
        logDebug(user,
            resourceToMerge.resourceType +
            ': merge new resource ' +
            '[' + resourceToMerge.id + ']: '
            + JSON.stringify(resourceToMerge)
        );
        if (env.CHECK_ACCESS_TAG_ON_SAVE === '1') {
            if (!doesResourceHaveAccessTags(resourceToMerge)) {
                throw new BadRequestError(new Error('Resource is missing a security access tag with system: https://www.icanbwell.com/access '));
            }
        }

        if (!resourceToMerge.meta) {
            // create the metadata
            /**
             * @type {function({Object}): Meta}
             */
            let Meta = getMeta(base_version);
            resourceToMerge.meta = new Meta({
                versionId: '1',
                lastUpdated: moment.utc().format('YYYY-MM-DDTHH:mm:ssZ'),
            });
        } else {
            resourceToMerge.meta.versionId = '1';
            resourceToMerge.meta.lastUpdated = moment.utc().format('YYYY-MM-DDTHH:mm:ssZ');
        }

        const cleaned = JSON.parse(JSON.stringify(resourceToMerge));
        const doc = Object.assign(cleaned, {_id: id});

        return await performMergeDbUpdate(resourceToMerge, doc, cleaned);
    }

    // this function is called for each resource
    // returns an OperationOutcome
    /**
     * Merges a single resource
     * @param {Object} resource_to_merge
     * @return {Promise<{operationOutcome: ?OperationOutcome, issue: {severity: string, diagnostics: string, code: string, expression: [string], details: {text: string}}, created: boolean, id: String, updated: boolean}>}
     */
    async function merge_resource(resource_to_merge) {
        /**
         * @type {String}
         */
        let id = resource_to_merge.id;

        if (env.LOG_ALL_SAVES) {
            await sendToS3('logs',
                resource_to_merge.resourceType,
                resource_to_merge,
                currentDate,
                id,
                'merge_' + requestId);
        }

        const preMergeCheckFailures = await preMergeChecks(resource_to_merge);
        if (preMergeCheckFailures) {
            return preMergeCheckFailures;
        }

        try {
            logDebug(user, '-----------------');
            logDebug(user, base_version);
            logDebug(user, '--- body ----');
            logDebug(user, resource_to_merge);

            // Grab an instance of our DB and collection
            /**
             * @type {import('mongodb').Db}
             */
            let db = globals.get(CLIENT_DB);
            /**
             * @type {import('mongodb').Collection}
             */
            let collection = db.collection(`${resource_to_merge.resourceType}_${base_version}`);

            // Query our collection for this id
            /**
             * @type {Object}
             */
            let data = await collection.findOne({id: id.toString()});

            logDebug('test?', '------- data -------');
            logDebug('test?', `${resource_to_merge.resourceType}_${base_version}`);
            logDebug('test?', data);
            logDebug('test?', '------- end data -------');

            let res;

            // check if resource was found in database or not
            // noinspection JSUnusedLocalSymbols
            if (data && data.meta) {
                res = await mergeExisting(resource_to_merge, data);
            } else {
                res = await mergeInsert(resource_to_merge);
            }

            return res;
        } catch (e) {
            logError(`Error with merging resource ${resource_to_merge.resourceType}.merge with id: ${id} `, e);
            const operationOutcome = {
                resourceType: 'OperationOutcome',
                issue: [
                    {
                        severity: 'error',
                        code: 'exception',
                        details: {
                            text: 'Error merging: ' + JSON.stringify(resource_to_merge)
                        },
                        diagnostics: e.toString(),
                        expression: [
                            resource_to_merge.resourceType + '/' + id
                        ]
                    }
                ]
            };
            await sendToS3('errors',
                resource_to_merge.resourceType,
                resource_to_merge,
                currentDate,
                id,
                'merge');
            await sendToS3('errors',
                resource_to_merge.resourceType,
                operationOutcome,
                currentDate,
                id,
                'merge_error');
            return {
                id: id,
                created: false,
                updated: false,
                issue: (operationOutcome.issue && operationOutcome.issue.length > 0) ? operationOutcome.issue[0] : null,
                operationOutcome: operationOutcome
            };
        }
    }

    /**
     * Tries to merge and retries if there is an error to protect against race conditions where 2 calls are happening
     *  in parallel for the same resource. Both of them see that the resource does not exist, one of them inserts it
     *  and then the other ones tries to insert too
     * @param {Object} resource_to_merge
     * @return {Promise<{operationOutcome: ?OperationOutcome, issue: {severity: string, diagnostics: string, code: string, expression: [string], details: {text: string}}, created: boolean, id: String, updated: boolean}>}
     */
    /**
     * merges resources and retries on error
     * @param resource_to_merge
     * @return {Promise<{operationOutcome: ?OperationOutcome, issue: {severity: string, diagnostics: string, code: string, expression: [string], details: {text: string}}, created: boolean, id: String, updated: boolean}>}
     */
    async function merge_resource_with_retry(resource_to_merge) {
        let triesLeft = 2;

        do {
            try {
                return await merge_resource(resource_to_merge);
            } catch (e) {
                triesLeft = triesLeft - 1;
            }
        } while (triesLeft >= 0);
    }

    // if the incoming request is a bundle then unwrap the bundle
    if ((!(Array.isArray(resources_incoming))) && resources_incoming['resourceType'] === 'Bundle') {
        logDebug(user, '--- validate schema of Bundle ----');
        const operationOutcome = validateResource(resources_incoming, 'Bundle', path);
        if (operationOutcome && operationOutcome.statusCode === 400) {
            return operationOutcome;
        }
        // unwrap the resources
        resources_incoming = resources_incoming.entry.map(e => e.resource);
    }
    if (Array.isArray(resources_incoming)) {
        const ids_of_resources = resources_incoming.map(r => r.id);
        logRequest(user,
            '==================' + resource_name + ': Merge received array ' +
            ', len= ' + resources_incoming.length +
            ' [' + ids_of_resources.toString() + '] ' +
            '===================='
        );
        // find items without duplicates and run them in parallel
        // but items with duplicate ids should run in serial so we can merge them properly (otherwise the first item
        //  may not finish adding to the db before the next item tries to merge
        // https://stackoverflow.com/questions/53212020/get-list-of-duplicate-objects-in-an-array-of-objects
        // create a lookup_by_id for duplicate ids
        /**
         * @type {Object}
         */
        const lookup_by_id = resources_incoming.reduce((a, e) => {
            a[e.id] = ++a[e.id] || 0;
            return a;
        }, {});
        /**
         * @type {Object[]}
         */
        const duplicate_id_resources = resources_incoming.filter(e => lookup_by_id[e.id]);
        /**
         * @type {Object[]}
         */
        const non_duplicate_id_resources = resources_incoming.filter(e => !lookup_by_id[e.id]);

        const result = await Promise.all([
            async.map(non_duplicate_id_resources, async x => await merge_resource_with_retry(x)), // run in parallel
            async.mapSeries(duplicate_id_resources, async x => await merge_resource_with_retry(x)) // run in series
        ]);
        const returnVal = result.flat(1);
        logDebug(user, '--- Merge array result ----');
        logDebug(user, JSON.stringify(returnVal));
        logDebug(user, '-----------------');
        return returnVal;
    } else {
        const returnVal = await merge_resource_with_retry(resources_incoming);
        logDebug(user, '--- Merge result ----');
        logDebug(user, JSON.stringify(returnVal));
        logDebug(user, '-----------------');
        return returnVal;
    }
};
