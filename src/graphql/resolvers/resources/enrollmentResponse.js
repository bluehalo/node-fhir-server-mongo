// This code is generated by a code generator.  Do not edit.
const {resolveType, findResourcesByReference, findResourceByReference, getResources} = require('../../common');

// noinspection JSUnusedLocalSymbols
module.exports = {
    Query: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        enrollmentResponse: async (parent, args, context, info) => {
            return await getResources(
                parent,
                args,
                context,
                info,
                'EnrollmentResponse'
            );
        }
    },
    EnrollmentResponseRequestProvider: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    EnrollmentResponse: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        request: async (parent, args, context, info) => {
            return await findResourceByReference(
                args,
                context,
                info,
                parent.request);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        organization: async (parent, args, context, info) => {
            return await findResourceByReference(
                args,
                context,
                info,
                parent.organization);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        requestProvider: async (parent, args, context, info) => {
            return await findResourceByReference(
                args,
                context,
                info,
                parent.requestProvider);
        },
    }
};

