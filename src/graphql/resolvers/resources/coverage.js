// This code is generated by a code generator.  Do not edit.
const {search} = require('../../../operations/search/search');
const {searchById} = require('../../../operations/searchById/searchById');
const {unBundle, resolveType, findResourcesByReference, findResourceByReference, getResources} = require('../../common');
const {NotFoundError} = require('../../../utils/httpErrors');

// noinspection JSUnusedLocalSymbols
module.exports = {
    Query: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        coverage: async (parent, args, context, info) => {
            return await getResources(
                parent,
                args,
                context,
                info,
                'Coverage'
            );
        }
    },
    CoveragePolicyHolder: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    CoverageSubscriber: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    CoveragePayor: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    Coverage: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        policyHolder: async (parent, args, context, info) => {
            return await findResourceByReference(parent.policyHolder);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        subscriber: async (parent, args, context, info) => {
            return await findResourceByReference(parent.subscriber);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        beneficiary: async (parent, args, context, info) => {
            return await findResourceByReference(parent.beneficiary);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        payor: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.payor);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        contract: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.contract);
        },
    }
};

