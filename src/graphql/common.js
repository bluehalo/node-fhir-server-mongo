const {searchById} = require('../operations/searchById/searchById');
const {search} = require('../operations/search/search');
const {NotFoundError} = require('../utils/httpErrors');
const {unBundle} = require('./common');
const async = require('async');
/**
 * This functions takes a FHIR Bundle and returns the resources in it
 * @param {{entry:{resource: Resource}[]}} bundle
 * @return {Resource[]}
 */
module.exports.unBundle = (bundle) => {
    return bundle.entry.map(e => e.resource);
};

// noinspection JSUnusedLocalSymbols
/**
 * This is to handle unions in GraphQL
 * @param obj
 * @param context
 * @param info
 * @return {null|string}
 */
// eslint-disable-next-line no-unused-vars
module.exports.resolveType = (obj, context, info) => {
    if (obj) {
        return obj.resourceType;
    }
    return null; // GraphQLError is thrown
};

/**
 * Finds a single resource by reference
 * @param {{reference: string}} reference
 * @return {Promise<null|Resource>}
 */
module.exports.findResourceByReference = async (reference) => {
    try {
        /**
         * @type {string}
         */
        const typeOfReference = reference.reference.split('/')[0];
        /**
         * @type {string}
         */
        const idOfReference = reference.reference.split('/')[1];
        return searchById(
            {base_version: '4_0_0', id: idOfReference},
            context.user,
            context.scope,
            typeOfReference,
            typeOfReference
        );
    } catch (e) {
        if (e instanceof NotFoundError) {
            return null;
        }
    }
};

/**
 * Finds one or more resources by references array
 * @param {{reference: string}[]} references
 * @return {Promise<null|Resource[]>}
 */
module.exports.findResourcesByReference = async (references) => {
    try {
        return await async.map(references, async reference => {
            /**
             * @type {string}
             */
            const typeOfReference = reference.reference.split('/')[0];
            /**
             * @type {string}
             */
            const idOfReference = reference.reference.split('/')[1];
            return unBundle(
                search(
                    {base_version: '4_0_0', id: idOfReference},
                    context.user,
                    context.scope,
                    typeOfReference,
                    typeOfReference
                )
            );
        });
    } catch (e) {
        if (e instanceof NotFoundError) {
            return null;
        }
    }
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
    return unBundle(
        await (
            search(
                {
                    base_version: '4_0_0',
                    _bundle: '1',
                    ...args
                },
                context.user,
                context.scope,
                resourceType,
                resourceType
            )
        )
    );
};
