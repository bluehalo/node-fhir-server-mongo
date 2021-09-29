// This code is generated by a code generator.  Do not edit.
const {resolveType, findResourcesByReference, findResourceByReference, getResources} = require('../../common');

// noinspection JSUnusedLocalSymbols
module.exports = {
    Query: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        chargeItem: async (parent, args, context, info) => {
            return await getResources(
                parent,
                args,
                context,
                info,
                'ChargeItem'
            );
        }
    },
    ChargeItemSubject: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    ChargeItemContext: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    ChargeItemEnterer: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    ChargeItemService: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    ChargeItemProductReference: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    ChargeItem: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        partOf: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.partOf);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        subject: async (parent, args, context, info) => {
            return await findResourceByReference(parent.subject);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        context: async (parent, args, context, info) => {
            return await findResourceByReference(parent.context);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        performingOrganization: async (parent, args, context, info) => {
            return await findResourceByReference(parent.performingOrganization);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        requestingOrganization: async (parent, args, context, info) => {
            return await findResourceByReference(parent.requestingOrganization);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        costCenter: async (parent, args, context, info) => {
            return await findResourceByReference(parent.costCenter);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        enterer: async (parent, args, context, info) => {
            return await findResourceByReference(parent.enterer);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        service: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.service);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        productReference: async (parent, args, context, info) => {
            return await findResourceByReference(parent.productReference);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        account: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.account);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        supportingInformation: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.supportingInformation);
        },
    }
};
