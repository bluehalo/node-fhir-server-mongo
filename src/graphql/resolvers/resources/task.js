// This code is generated by a code generator.  Do not edit.
const {resolveType, findResourcesByReference, findResourceByReference, getResources} = require('../../common');

// noinspection JSUnusedLocalSymbols
module.exports = {
    Query: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        task: async (parent, args, context, info) => {
            return await getResources(
                parent,
                args,
                context,
                info,
                'Task'
            );
        }
    },
    TaskRequester: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    TaskOwner: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    TaskInsurance: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    Task: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        basedOn: async (parent, args, context, info) => {
            return await findResourcesByReference(
                args,
                context,
                info,
                parent.basedOn);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        partOf: async (parent, args, context, info) => {
            return await findResourcesByReference(
                args,
                context,
                info,
                parent.partOf);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        focus: async (parent, args, context, info) => {
            return await findResourceByReference(
                args,
                context,
                info,
                parent.focus);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        for: async (parent, args, context, info) => {
            return await findResourceByReference(
                args,
                context,
                info,
                parent.for);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        encounter: async (parent, args, context, info) => {
            return await findResourceByReference(
                args,
                context,
                info,
                parent.encounter);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        requester: async (parent, args, context, info) => {
            return await findResourceByReference(
                args,
                context,
                info,
                parent.requester);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        owner: async (parent, args, context, info) => {
            return await findResourceByReference(
                args,
                context,
                info,
                parent.owner);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        location: async (parent, args, context, info) => {
            return await findResourceByReference(
                args,
                context,
                info,
                parent.location);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        reasonReference: async (parent, args, context, info) => {
            return await findResourceByReference(
                args,
                context,
                info,
                parent.reasonReference);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        insurance: async (parent, args, context, info) => {
            return await findResourcesByReference(
                args,
                context,
                info,
                parent.insurance);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        relevantHistory: async (parent, args, context, info) => {
            return await findResourcesByReference(
                args,
                context,
                info,
                parent.relevantHistory);
        },
    }
};

