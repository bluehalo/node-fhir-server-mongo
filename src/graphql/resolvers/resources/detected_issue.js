// This code is generated by a code generator.  Do not edit.
const {resolveType, findResourcesByReference, findResourceByReference, getResources} = require('../../common');

// noinspection JSUnusedLocalSymbols
module.exports = {
    Query: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        detectedIssue: async (parent, args, context, info) => {
            return await getResources(
                parent,
                args,
                context,
                info,
                'DetectedIssue'
            );
        }
    },
    DetectedIssueAuthor: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    DetectedIssue: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        patient: async (parent, args, context, info) => {
            return await findResourceByReference(parent.patient);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        author: async (parent, args, context, info) => {
            return await findResourceByReference(parent.author);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        implicated: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.implicated);
        },
    }
};
