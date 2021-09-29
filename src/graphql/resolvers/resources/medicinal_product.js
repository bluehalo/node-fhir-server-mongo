// This code is generated by a code generator.  Do not edit.
const {resolveType, findResourcesByReference, findResourceByReference, getResources} = require('../../common');

// noinspection JSUnusedLocalSymbols
module.exports = {
    Query: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        medicinalProduct: async (parent, args, context, info) => {
            return await getResources(
                parent,
                args,
                context,
                info,
                'MedicinalProduct'
            );
        }
    },
    MedicinalProductContact: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    MedicinalProduct: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        pharmaceuticalProduct: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.pharmaceuticalProduct);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        packagedMedicinalProduct: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.packagedMedicinalProduct);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        attachedDocument: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.attachedDocument);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        masterFile: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.masterFile);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        contact: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.contact);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        clinicalTrial: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.clinicalTrial);
        },
    }
};

