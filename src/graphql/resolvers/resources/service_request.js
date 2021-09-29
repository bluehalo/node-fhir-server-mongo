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
        serviceRequest: async (parent, args, context, info) => {
            return await getResources(
                parent,
                args,
                context,
                info,
                'ServiceRequest'
            );
        }
    },
    ServiceRequestBasedOn: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    ServiceRequestSubject: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    ServiceRequestRequester: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    ServiceRequestPerformer: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    ServiceRequestReasonReference: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    ServiceRequestInsurance: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    ServiceRequest: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        basedOn: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.basedOn);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        replaces: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.replaces);
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
            return await findResourcesByReference(parent.performer);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        locationReference: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.locationReference);
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
        specimen: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.specimen);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        relevantHistory: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.relevantHistory);
        },
    }
};

