const {DataSource} = require('apollo-datasource');
const {search} = require('../operations/search/search');
const {getRequestInfo} = require('./requestInfoHelper');
const {searchById} = require('../operations/searchById/searchById');
const {logWarn} = require('../operations/common/logging');
const async = require('async');
const DataLoader = require('dataloader');

/**
 * https://stackoverflow.com/questions/14446511/most-efficient-method-to-groupby-on-an-array-of-objects
 * @param {*[]} sourceArray
 * @param key
 * @return {*}
 */
const groupBy = function (sourceArray, key) {
    return sourceArray.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
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
     * batch
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
        /**
         * @type {*|Promise<unknown>}
         */
        const results = await async.flatMap(Object.entries(groupKeysByResourceType), async groupKeysByResourceTypeKey => {
            /**
             * @type {ResourceWithId}
             */
            const [resourceType, resources] = groupKeysByResourceTypeKey;
            const idOfReference = resources.map(r => r.id);
            return await search(
                getRequestInfo(context),
                {
                    base_version: '4_0_0',
                    id: idOfReference,
                    _bundle: '1',
                    _debug: '1'
                },
                resourceType,
                resourceType
            );
        });

        return results;
    }

    /**
     * This functions takes a FHIR Bundle and returns the resources in it
     * @param {{entry:{resource: Resource}[]}} bundle
     * @return {Resource[]}
     */
    unBundle(bundle) {
        if (bundle.meta) {
            this.meta.push(bundle.meta);
        }
        return bundle.entry.map(e => e.resource);
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
            // return await searchById(
            //     getRequestInfo(context),
            //     {base_version: '4_0_0', id: idOfReference},
            //     typeOfReference,
            //     typeOfReference
            // );
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
                return this.unBundle(
                    await this.dataLoader.load(
                        new ResourceWithId(
                            typeOfReference,
                            idOfReference
                        )
                    )
                );
                // return this.unBundle(
                //     await search(
                //         getRequestInfo(context),
                //         {
                //             base_version: '4_0_0',
                //             id: idOfReference,
                //             _bundle: '1',
                //             _debug: '1'
                //         },
                //         typeOfReference,
                //         typeOfReference
                //     )
                // );
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
}

module.exports = {
    FhirDataSource: FhirDataSource
};
