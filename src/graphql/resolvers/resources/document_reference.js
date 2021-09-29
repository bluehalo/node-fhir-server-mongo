// This code is generated by a code generator.  Do not edit.
const {resolveType, findResourcesByReference, findResourceByReference, getResources} = require('../../common');

// noinspection JSUnusedLocalSymbols
module.exports = {
    Query: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        documentReference: async (parent, args, context, info) => {
            return await getResources(
                parent,
                args,
                context,
                info,
                'DocumentReference'
            );
        }
    },
    DocumentReferenceSubject: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    DocumentReferenceAuthor: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    DocumentReferenceAuthenticator: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    DocumentReference: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        subject: async (parent, args, context, info) => {
            return await findResourceByReference(parent.subject);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        author: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.author);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        authenticator: async (parent, args, context, info) => {
            return await findResourceByReference(parent.authenticator);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        custodian: async (parent, args, context, info) => {
            return await findResourceByReference(parent.custodian);
        },
    }
};
