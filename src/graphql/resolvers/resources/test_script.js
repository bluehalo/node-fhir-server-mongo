// This code is generated by a code generator.  Do not edit.
const {resolveType, findResourcesByReference, findResourceByReference, getResources} = require('../../common');

// noinspection JSUnusedLocalSymbols
module.exports = {
    Query: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        testScript: async (parent, args, context, info) => {
            return await getResources(
                parent,
                args,
                context,
                info,
                'TestScript'
            );
        }
    },
    TestScript: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        profile: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.profile);
        },
    }
};

