// This code is generated by a code generator.  Do not edit.
const {resolveType, findResourcesByReference, findResourceByReference, getResources} = require('../../common');

// noinspection JSUnusedLocalSymbols
module.exports = {
    Query: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        medicinalProductPharmaceutical: async (parent, args, context, info) => {
            return await getResources(
                parent,
                args,
                context,
                info,
                'MedicinalProductPharmaceutical'
            );
        }
    },
    MedicinalProductPharmaceutical: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        ingredient: async (parent, args, context, info) => {
            return await findResourcesByReference(
                args,
                context,
                info,
                parent.ingredient);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        device: async (parent, args, context, info) => {
            return await findResourcesByReference(
                args,
                context,
                info,
                parent.device);
        },
    }
};

