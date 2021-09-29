// This code is generated by a code generator.  Do not edit.
const {resolveType, findResourcesByReference, findResourceByReference, getResources} = require('../../common');

// noinspection JSUnusedLocalSymbols
module.exports = {
    Query: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        substanceSpecification: async (parent, args, context, info) => {
            return await getResources(
                parent,
                args,
                context,
                info,
                'SubstanceSpecification'
            );
        }
    },
    SubstanceSpecification: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        source: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.source);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        referenceInformation: async (parent, args, context, info) => {
            return await findResourceByReference(parent.referenceInformation);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        nucleicAcid: async (parent, args, context, info) => {
            return await findResourceByReference(parent.nucleicAcid);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        polymer: async (parent, args, context, info) => {
            return await findResourceByReference(parent.polymer);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        protein: async (parent, args, context, info) => {
            return await findResourceByReference(parent.protein);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        sourceMaterial: async (parent, args, context, info) => {
            return await findResourceByReference(parent.sourceMaterial);
        },
    }
};

