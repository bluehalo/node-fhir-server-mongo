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
        paymentNotice: async (parent, args, context, info) => {
            return await getResources(
                parent,
                args,
                context,
                info,
                'PaymentNotice'
            );
        }
    },
    PaymentNoticeProvider: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    PaymentNoticePayee: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    PaymentNotice: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        request: async (parent, args, context, info) => {
            return await findResourceByReference(parent.request);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        response: async (parent, args, context, info) => {
            return await findResourceByReference(parent.response);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        provider: async (parent, args, context, info) => {
            return await findResourceByReference(parent.provider);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        payment: async (parent, args, context, info) => {
            return await findResourceByReference(parent.payment);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        payee: async (parent, args, context, info) => {
            return await findResourceByReference(parent.payee);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        recipient: async (parent, args, context, info) => {
            return await findResourceByReference(parent.recipient);
        },
    }
};

