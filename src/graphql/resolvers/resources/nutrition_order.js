// This code is generated by a code generator.  Do not edit.
const {resolveType, findResourcesByReference, findResourceByReference, getResources} = require('../../common');

// noinspection JSUnusedLocalSymbols
module.exports = {
    Query: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        nutritionOrder: async (parent, args, context, info) => {
            return await getResources(
                parent,
                args,
                context,
                info,
                'NutritionOrder'
            );
        }
    },
    NutritionOrderOrderer: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    NutritionOrder: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        patient: async (parent, args, context, info) => {
            return await findResourceByReference(parent.patient);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        encounter: async (parent, args, context, info) => {
            return await findResourceByReference(parent.encounter);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        orderer: async (parent, args, context, info) => {
            return await findResourceByReference(parent.orderer);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        allergyIntolerance: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.allergyIntolerance);
        },
    }
};
