const {DataSource} = require('apollo-datasource');
const {search} = require('../../operations/search/search');
const {getRequestInfo} = require('./requestInfoHelper');
const {logWarn} = require('../../operations/common/logging');
const async = require('async');
const DataLoader = require('dataloader');
const {groupBy} = require('../../utils/list.util');


/**
 * This class stores the tuple of resourceType and id to uniquely identify a resource
 */
class ResourceWithId {
    constructor(resourceType, id) {
        /**
         * @type {string}
         */
        this.resourceType = resourceType;
        /**
         * @type {string}
         */
        this.id = id;
    }
}

/**
 * This class implements the DataSource pattern so it is called by our GraphQL resolvers to load the data
 */
class FhirDataSource extends DataSource {
    /**
     * @param {RequestInfo} requestInfo
     */
    constructor(requestInfo) {
        super();
        /**
         * @type {RequestInfo}
         */
        this.requestInfo = requestInfo;
        /**
         * @type {DataLoader<unknown, {resourceType: string, id: string}, Resource>}
         */
        this.dataLoader = new DataLoader(
            async (keys) => await this.getResourcesInBatch(keys, requestInfo)
        );
        this.meta = [];
    }

    initialize(config) {
        return super.initialize(config);
    }

    /**
     * This function takes a FHIR Bundle and returns the resources in it
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
     * This function orders the resources by key so DataLoader can find the right results
     * https://github.com/graphql/dataloader#batching
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
     * gets resources for the passed in keys
     * https://github.com/graphql/dataloader#batching
     * @param {ResourceWithId[]} keys
     * @param requestInfo
     * @return {Promise<Resource[]|{entry: {resource: Resource}[]}>}
     */
    async getResourcesInBatch(keys, requestInfo) {
        // separate by resourceType
        /**
         * Each field in the object is the key
         * @type {Object}
         */
        const groupKeysByResourceType = groupBy(keys, 'resourceType');
        // noinspection UnnecessaryLocalVariableJS
        /**
         * @type {Resource[]}
         */
        const results = this.reorderResources(
            // run the loads in parallel by resourceType
            await async.flatMap(Object.entries(groupKeysByResourceType), async groupKeysByResourceTypeKey => {
                // resourceType is a string and resources is a list of resources of that resourceType
                const [resourceType, resources] = groupKeysByResourceTypeKey;
                /**
                 * @type {String}
                 */
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
        if (!Array.isArray(obj)) {
            return obj.resourceType;
        }
        if (obj.length > 0) {
            // apollo does not seem to allow returning lists.  Uncomment when Apollo supports that.
            // return obj.map(o => resolveType(o, context, info));
            return obj[0].resourceType;
        } else {
            return null;
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
         * @type {string[]}
         */
        const references = reference.reference.split('/');
        if (references.length !== 2) {
            return null;
        }
        /**
         * first part of the reference is the resourceType
         * @type {string}
         */
        const typeOfReference = references[0];
        /**
         * second part is the id of the resource
         * @type {string}
         */
        const idOfReference = references[1];
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
            } else {
                throw e;
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
            return await this.findResourceByReference(
                parent, args, context, info, reference
            );
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
