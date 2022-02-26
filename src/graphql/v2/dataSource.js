const {DataSource} = require('apollo-datasource');
const {search} = require('../../operations/search/search');
const {getRequestInfo} = require('./requestInfoHelper');
const {logWarn} = require('../../operations/common/logging');
const async = require('async');
const DataLoader = require('dataloader');

/**
 * https://stackoverflow.com/questions/14446511/most-efficient-method-to-groupby-on-an-array-of-objects
 * @param {*[]} sourceArray
 * @param key
 * @return {*}
 */
const groupBy = function (sourceArray, key) { // `sourceArray` is an array of objects, `key` is the key (or property accessor) to group by
    // reduce runs this anonymous function on each element of `sourceArray` (the `item` parameter,
    // returning the `storage` parameter at the end
    return sourceArray.reduce(function (storage, item) {
        // get the first instance of the key by which we're grouping
        const group = item[`${key}`];

        // set `storage` for this instance of group to the outer scope (if not empty) or initialize it
        storage[`${group}`] = storage[`${group}`] || [];

        // add this item to its group within `storage`
        storage[`${group}`].push(item);

        // return the updated storage to the reduce function, which will then loop through the next
        return storage;
    }, {}); // {} is the initial value of the storage
};

class ResourceWithId {
    constructor(resourceType, id) {
        this.resourceType = resourceType;
        this.id = id;
    }
}

class FhirDataSource extends DataSource {
    constructor(requestInfo) {
        super();
        this.requestInfo = requestInfo;
        this.dataLoader = new DataLoader(
            async (keys) => await this.myBatchGetUsers(keys, requestInfo)
        );
        this.meta = [];
    }

    initialize(config) {
        return super.initialize(config);
    }

    /**
     * This functions takes a FHIR Bundle and returns the resources in it
     * @param {Resource[]|{entry: {resource: Resource}[]}} bundle
     * @return {Resource[]}
     */
    unBundle(bundle) {
        if (bundle.meta) {
            this.meta.push(bundle.meta);
        }
        return bundle.entry.map(e => e.resource);
    }

    /**
     * This functions takes a FHIR Bundle and returns the resources in it
     * @param {{Resource}[]} resources
     * @param {ResourceWithId[]} keys
     * @return {Resource[]}
     */
    async reorderResources(resources, keys) {
        // now order them the same way
        const resultsOrdered = [];
        for (const {resourceType, id} of keys) {
            const items = resources.filter(r => r.resourceType === resourceType && r.id === id);
            resultsOrdered.push(
                items.length > 0 ? items[0] : null
            );
        }
        return resultsOrdered;
    }

    /**
     * batch
     * https://github.com/graphql/dataloader#batching
     * @param {ResourceWithId[]} keys
     * @param requestInfo
     * @return {Promise<Resource[]|{entry: {resource: Resource}[]}>}
     */
    async myBatchGetUsers(keys, requestInfo) {
        // separate by resourceType
        /**
         * Each field in the object is the key
         * @type {Object}
         */
        const groupKeysByResourceType = groupBy(keys, 'resourceType');
        // noinspection UnnecessaryLocalVariableJS
        /**
         * @type {*|Promise<unknown>}
         */
        const results = this.reorderResources(
            await async.flatMap(Object.entries(groupKeysByResourceType), async groupKeysByResourceTypeKey => {
                /**
                 * @type {ResourceWithId}
                 */
                const [resourceType, resources] = groupKeysByResourceTypeKey;
                const idOfReference = resources.map(r => r.id).join(',');
                return this.unBundle(
                    await search(
                        requestInfo,
                        {
                            base_version: '4_0_0',
                            id: idOfReference,
                            _bundle: '1',
                            _debug: '1'
                        },
                        resourceType,
                        resourceType
                    )
                );
            }),
            keys
        );

        return results;
    }

    /**
     * This is to handle unions in GraphQL
     * @param obj
     * @param context
     * @param info
     * @return {null|string}
     */
    // noinspection JSUnusedLocalSymbols
    // eslint-disable-next-line no-unused-vars
    resolveType(obj, context, info) {
        if (Array.isArray(obj)) {
            if (obj.length > 0) {
                // apollo does not seem to allow returning lists
                // return obj.map(o => resolveType(o, context, info));
                return obj[0].resourceType;
            } else {
                return null;
            }
        } else {
            return obj.resourceType;
        }
    }

    /**
     * Finds a single resource by reference
     * @param {Resource} parent
     * @param args
     * @param context
     * @param info
     * @param {{reference: string}} reference
     * @return {Promise<null|Resource>}
     */
    async findResourceByReference(parent, args, context, info, reference) {
        if (!(reference)) {
            return null;
        }
        /**
         * @type {string}
         */
        const typeOfReference = reference.reference.split('/')[0];
        /**
         * @type {string}
         */
        const idOfReference = reference.reference.split('/')[1];
        try {
            return await this.dataLoader.load(
                new ResourceWithId(
                    typeOfReference,
                    idOfReference
                )
            );
        } catch (e) {
            if (e.name === 'NotFound') {
                logWarn(context.user, `findResourceByReference: Resource ${typeOfReference}/${idOfReference} not found for parent:${parent.resourceType}/${parent.id} `);
                return null;
            }
        }
    }

    /**
     * Finds one or more resources by references array
     * @param {Resource} parent
     * @param args
     * @param context
     * @param info
     * @param {{reference: string}[]} references
     * @return {Promise<null|Resource[]>}
     */
    async findResourcesByReference(parent, args, context, info, references) {
        if (!(references)) {
            return null;
        }
        return async.flatMap(references, async reference => {
            /**
             * @type {string}
             */
            const typeOfReference = reference.reference.split('/')[0];
            /**
             * @type {string}
             */
            const idOfReference = reference.reference.split('/')[1];
            try {
                return await this.dataLoader.load(
                    new ResourceWithId(
                        typeOfReference,
                        idOfReference
                    )
                );
            } catch (e) {
                if (e.name === 'NotFound') {
                    logWarn(context.user, `findResourcesByReference: Resource ${typeOfReference}/${idOfReference} not found for parent:${parent.resourceType}/${parent.id}`);
                    return null;
                } else {
                    throw e;
                }
            }
        });
    }

    /**
     * Finds resources with args
     * @param parent
     * @param args
     * @param context
     * @param info
     * @param {string} resourceType
     * @return {Promise<Resource[]>}
     */
    async getResources(parent, args, context, info, resourceType) {
        // https://www.apollographql.com/blog/graphql/filtering/how-to-search-and-filter-results-with-graphql/
        return this.unBundle(
            await search(
                getRequestInfo(context),
                {
                    base_version: '4_0_0',
                    _bundle: '1',
                    ...args,
                    _debug: '1'
                },
                resourceType,
                resourceType
            )
        );
    }

    /**
     * Finds resources with args
     * @param parent
     * @param args
     * @param context
     * @param info
     * @param {string} resourceType
     * @return {Promise<Resource[]>}
     */
    async getResourcesBundle(parent, args, context, info, resourceType) {
        // https://www.apollographql.com/blog/graphql/filtering/how-to-search-and-filter-results-with-graphql/
        return search(
            getRequestInfo(context),
            {
                base_version: '4_0_0',
                _bundle: '1',
                ...args,
                _debug: '1'
            },
            resourceType,
            resourceType
        );
    }
}

module.exports = {
    FhirDataSource: FhirDataSource
};
