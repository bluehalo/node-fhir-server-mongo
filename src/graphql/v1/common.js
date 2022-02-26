/**
 * Implements helper functions for graphql
 */

const {searchById} = require('../operations/searchById/searchById');
const {search} = require('../operations/search/search');
const async = require('async');
const {logWarn} = require('../operations/common/logging');
const {getRequestInfo} = require('./requestInfoHelper');
/**
 * This functions takes a FHIR Bundle and returns the resources in it
 * @param {{entry:{resource: Resource}[]}} bundle
 * @return {Resource[]}
 */
module.exports.unBundle = (bundle) => {
    return bundle.entry.map(e => e.resource);
};

/**
 * This is to handle unions in GraphQL
 * @param obj
 * @param context
 * @param info
 * @return {null|string}
 */
// noinspection JSUnusedLocalSymbols
// eslint-disable-next-line no-unused-vars
module.exports.resolveType = (obj, context, info) => {
    if (obj) {
        return obj.resourceType;
    }
    return null; // GraphQLError is thrown
};

/**
 * Finds a single resource by reference
 * @param {Resource} parent
 * @param args
 * @param context
 * @param info
 * @param {{reference: string}} reference
 * @return {Promise<null|Resource>}
 */
module.exports.findResourceByReference = async (parent, args, context, info, reference) => {
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
        return await searchById(
            getRequestInfo(context),
            {base_version: '4_0_0', id: idOfReference},
            typeOfReference,
            typeOfReference
        );
    } catch (e) {
        if (e.name === 'NotFound') {
            logWarn(context.user, `findResourceByReference: Resource ${typeOfReference}/${idOfReference} not found for parent:${parent.resourceType}/${parent.id} `);
            return null;
        }
    }
};

/**
 * Finds one or more resources by references array
 * @param {Resource} parent
 * @param args
 * @param context
 * @param info
 * @param {{reference: string}[]} references
 * @return {Promise<null|Resource[]>}
 */
module.exports.findResourcesByReference = async (parent, args, context, info, references) => {
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
            return module.exports.unBundle(
                await search(
                    getRequestInfo(context),
                    {
                        base_version: '4_0_0',
                        id: idOfReference,
                        _bundle: '1',
                    },
                    typeOfReference,
                    typeOfReference
                )
            );
        } catch (e) {
            if (e.name === 'NotFound') {
                logWarn(context.user, `findResourcesByReference: Resource ${typeOfReference}/${idOfReference} not found for parent:${parent.resourceType}/${parent.id}`);
                return null;
            }
        }
    });
};

// noinspection JSUnusedLocalSymbols
/**
 * Finds resources with args
 * @param parent
 * @param args
 * @param context
 * @param info
 * @param {string} resourceType
 * @return {Promise<Resource[]>}
 */
// eslint-disable-next-line no-unused-vars
module.exports.getResources = async (parent, args, context, info, resourceType) => {
    // https://www.apollographql.com/blog/graphql/filtering/how-to-search-and-filter-results-with-graphql/
    // TODO: iterate over the keys in args.  handle all the search parameters in src/graphql/schemas/inputs
    return module.exports.unBundle(
        await search(
            getRequestInfo(context),
            {
                base_version: '4_0_0',
                _bundle: '1',
                ...args
            },
            resourceType,
            resourceType
        )
    );
};
