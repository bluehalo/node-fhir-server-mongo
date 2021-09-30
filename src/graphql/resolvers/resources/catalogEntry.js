// This code is generated by a code generator.  Do not edit.
const {resolveType, findResourcesByReference, findResourceByReference, getResources} = require('../../common');

// noinspection JSUnusedLocalSymbols
module.exports = {
    Query: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        catalogEntry: async (parent, args, context, info) => {
            return await getResources(
                parent,
                args,
                context,
                info,
                'CatalogEntry'
            );
        }
    },
    CatalogEntryReferencedItem: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    CatalogEntry: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        referencedItem: async (parent, args, context, info) => {
            return await findResourceByReference(
                args,
                context,
                info,
                parent.referencedItem);
        },
    }
};

