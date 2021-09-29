// This code is generated by a code generator.  Do not edit.
const {resolveType, findResourcesByReference, findResourceByReference, getResources} = require('../../common');

// noinspection JSUnusedLocalSymbols
module.exports = {
    Query: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        medicinalProductAuthorization: async (parent, args, context, info) => {
            return await getResources(
                parent,
                args,
                context,
                info,
                'MedicinalProductAuthorization'
            );
        }
    },
    MedicinalProductAuthorizationSubject: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    MedicinalProductAuthorization: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        subject: async (parent, args, context, info) => {
            return await findResourceByReference(parent.subject);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        holder: async (parent, args, context, info) => {
            return await findResourceByReference(parent.holder);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        regulator: async (parent, args, context, info) => {
            return await findResourceByReference(parent.regulator);
        },
    }
};
