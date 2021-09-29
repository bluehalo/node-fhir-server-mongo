// This code is generated by a code generator.  Do not edit.
const {resolveType, findResourcesByReference, findResourceByReference, getResources} = require('../../common');

// noinspection JSUnusedLocalSymbols
module.exports = {
    Query: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        biologicallyDerivedProduct: async (parent, args, context, info) => {
            return await getResources(
                parent,
                args,
                context,
                info,
                'BiologicallyDerivedProduct'
            );
        }
    },
    BiologicallyDerivedProduct: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        request: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.request);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        parent: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.parent);
        },
    }
};
