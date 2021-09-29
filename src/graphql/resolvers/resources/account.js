// This code is generated by a code generator.  Do not edit.
const {resolveType, findResourcesByReference, findResourceByReference, getResources} = require('../../common');

// noinspection JSUnusedLocalSymbols
module.exports = {
    Query: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        account: async (parent, args, context, info) => {
            return await getResources(
                parent,
                args,
                context,
                info,
                'Account'
            );
        }
    },
    AccountSubject: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    Account: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        subject: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.subject);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        owner: async (parent, args, context, info) => {
            return await findResourceByReference(parent.owner);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        partOf: async (parent, args, context, info) => {
            return await findResourceByReference(parent.partOf);
        },
    }
};

