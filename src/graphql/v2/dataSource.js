const {DataSource} = require('apollo-datasource');
const {search} = require('../../operations/search/search');
const {getRequestInfo} = require('./requestInfoHelper');
const {logWarn} = require('../../operations/common/logging');
const async = require('async');
const DataLoader = require('dataloader');
const {groupByLambda} = require('../../utils/list.util');

/**
 * This class stores the tuple of resourceType and id to uniquely identify a resource
 */
class ResourceWithId {
    /**
     * returns key for resourceType and id combination
     * @param {string} resourceType
     * @param {string} id
     * @return {string}
     */
    static getReferenceKey(resourceType, id) {
        return `${resourceType}/${id}`;
    }

    /**
     * gets resourceType and id from reference
     * @param {string} reference
     * @return {null|{id: string, resourceType: string}}
     */
    static getResourceTypeAndIdFromReference(reference) {
        /**
         * @type {string[]}
         */
        const references = reference.split('/');
        if (references.length !== 2) {
            return null;
        }
        return {resourceType: references[0], id: references[1]};
    }

    /**
     * gets resourceType reference
     * @param {string} reference
     * @return {null|string}
     */
    static getResourceTypeFromReference(reference) {
        const reference1 = this.getResourceTypeAndIdFromReference(reference);
        return reference1.resourceType;
    }

    /**
     * gets resourceType id
     * @param {string} reference
     * @return {null|string}
     */
    static getIdFromReference(reference) {
        const reference1 = this.getResourceTypeAndIdFromReference(reference);
        return reference1.id;
    }
}

/**
 * This class implements the DataSource pattern, so it is called by our GraphQL resolvers to load the data
 */
class FhirDataSource extends DataSource {
    /**
     * @param {import('../../utils/requestInfo').RequestInfo} requestInfo
     */
    constructor(requestInfo) {
        super();
        /**
         * @type {import('../../utils/requestInfo').RequestInfo}}
         */
        this.requestInfo = requestInfo;
        /**
         * @type {DataLoader<unknown, {resourceType: string, id: string}, Resource>}
         */
        this.dataLoader = new DataLoader(
            async (keys) => await this.getResourcesInBatch(keys, requestInfo)
        );
        /**
         * @type {Meta[]}
         */
        this.metaList = [];
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
            this.metaList.push(bundle.meta);
        }
        return bundle.entry.map(e => e.resource);
    }

    /**
     * This function orders the resources by key so DataLoader can find the right results
     * https://github.com/graphql/dataloader#batching
     * @param {{Resource}[]} resources
     * @param {string[]} keys
     * @return {Resource[]}
     */
    async reorderResources(resources, keys) {
        // now order them the same way
        /**
         * @type {?Resource[]}
         */
        const resultsOrdered = [];
        for (const /** @type {string} */ key of keys) {
            const {
                /** @type {string} */
                resourceType,
                /** @type {string} */
                id
            } = ResourceWithId.getResourceTypeAndIdFromReference(key);
            /**
             * resources with this resourceType and id
             * @type {{Resource}[]}
             */
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
     * @param {string[]} keys
     * @param {import('../../utils/requestInfo').RequestInfo} requestInfo
     * @return {Promise<Resource[]|{entry: {resource: Resource}[]}>}
     */
    async getResourcesInBatch(keys, requestInfo) {
        // separate by resourceType
        /**
         * Each field in the object is the key
         * @type {Object}
         */
        const groupKeysByResourceType = groupByLambda(
            keys,
            key => ResourceWithId.getResourceTypeFromReference(key)
        );
        // noinspection UnnecessaryLocalVariableJS
        /**
         * @type {Resource[]}
         */
        const results = this.reorderResources(
            // run the loads in parallel by resourceType
            await async.flatMap(Object.entries(groupKeysByResourceType), async groupKeysByResourceTypeKey => {
                // resourceType is a string and resources is a list of resources of that resourceType
                const [
                    /** @type {string} **/
                    resourceType,
                    /** @type {string[]} **/
                    references
                ] = groupKeysByResourceTypeKey;
                /**
                 * @type {string[]}
                 */
                const idsOfReference = references
                    .map(r => ResourceWithId.getIdFromReference(r))
                    .filter(r => r !== null);
                return this.unBundle(
                    await search(
                        requestInfo,
                        {
                            base_version: '4_0_0',
                            id: idsOfReference,
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
        const {
            /** @type {string} **/
            resourceType,
            /** @type {string} **/
            id
        } = ResourceWithId.getResourceTypeAndIdFromReference(reference.reference);
        try {
            return await this.dataLoader.load(
                ResourceWithId.getReferenceKey(
                    resourceType,
                    id
                )
            );
        } catch (e) {
            if (e.name === 'NotFound') {
                logWarn(
                    context.user,
                    `findResourceByReference: Resource ${resourceType}/${id} not found`
                    + ` for parent:${parent.resourceType}/${parent.id} `
                );
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
        const bundle = await search(
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
        if (bundle.meta) {
            this.metaList.push(bundle.meta);
        }
        return bundle;
    }

    /**
     * combined the meta tags of all the queries and returns as one
     * @return {null|Meta}
     */
    getBundleMeta() {
        if (this.metaList.length === 0) {
            return null;
        }
        // noinspection JSValidateTypes
        /**
         * @type {Meta}
         */
        const combinedMeta = {
            tag: []
        };
        // get list of properties from first meta
        for (const /** @type {Meta} **/ meta of this.metaList) {
            for (const /** @type {system: string, display: string, code: string} **/ metaTag of meta.tag) {
                const foundCombinedMetaTag = combinedMeta.tag.find(tag => tag.system === metaTag.system);
                if (!foundCombinedMetaTag) {
                    combinedMeta.tag.push(metaTag);
                } else {
                    // concatenate code and/or display
                    if (metaTag.display && foundCombinedMetaTag.display) {
                        foundCombinedMetaTag.display = foundCombinedMetaTag.display + ',' + metaTag.display;
                    }
                    if (metaTag.code && foundCombinedMetaTag.code) {
                        foundCombinedMetaTag.code = foundCombinedMetaTag.code + ',' + metaTag.code;
                    }
                }
            }
        }

        // wrap all tag codes and display in [] to make it valid json
        for (const /** @type {system: string, display: string, code: string} **/ combinedMetaTag of combinedMeta.tag) {
            if (combinedMetaTag.display) {
                combinedMetaTag.display = '[' + combinedMetaTag.display + ']';
            }
            if (combinedMetaTag.code) {
                combinedMetaTag.code = '[' + combinedMetaTag.code + ']';
            }
        }
        return combinedMeta;
    }
}

module.exports = {
    FhirDataSource: FhirDataSource
};
