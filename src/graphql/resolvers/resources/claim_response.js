// This code is generated by a code generator.  Do not edit.
const {resolveType, findResourcesByReference, findResourceByReference, getResources} = require('../../common');

// noinspection JSUnusedLocalSymbols
module.exports = {
    Query: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        claimResponse: async (parent, args, context, info) => {
            return await getResources(
                parent,
                args,
                context,
                info,
                'ClaimResponse'
            );
        }
    },
    ClaimResponseRequestor: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    ClaimResponse: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        patient: async (parent, args, context, info) => {
            return await findResourceByReference(parent.patient);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        insurer: async (parent, args, context, info) => {
            return await findResourceByReference(parent.insurer);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        requestor: async (parent, args, context, info) => {
            return await findResourceByReference(parent.requestor);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        request: async (parent, args, context, info) => {
            return await findResourceByReference(parent.request);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        communicationRequest: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.communicationRequest);
        },
    }
};
