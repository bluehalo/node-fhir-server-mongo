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
        deviceRequest: async (parent, args, context, info) => {
            return await getResources(
                parent,
                args,
                context,
                info,
                'DeviceRequest'
            );
        }
    },
    DeviceRequestSubject: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    DeviceRequestRequester: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    DeviceRequestPerformer: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    DeviceRequestReasonReference: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    DeviceRequestInsurance: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    DeviceRequest: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        basedOn: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.basedOn);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        priorRequest: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.priorRequest);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        codeReference: async (parent, args, context, info) => {
            return await findResourceByReference(parent.codeReference);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        subject: async (parent, args, context, info) => {
            return await findResourceByReference(parent.subject);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        encounter: async (parent, args, context, info) => {
            return await findResourceByReference(parent.encounter);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        requester: async (parent, args, context, info) => {
            return await findResourceByReference(parent.requester);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        performer: async (parent, args, context, info) => {
            return await findResourceByReference(parent.performer);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        reasonReference: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.reasonReference);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        insurance: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.insurance);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        supportingInfo: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.supportingInfo);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        relevantHistory: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.relevantHistory);
        },
    }
};

