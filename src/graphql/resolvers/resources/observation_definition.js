// This code is generated by a code generator.  Do not edit.
const {resolveType, findResourcesByReference, findResourceByReference, getResources} = require('../../common');

// noinspection JSUnusedLocalSymbols
module.exports = {
    Query: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        observationDefinition: async (parent, args, context, info) => {
            return await getResources(
                parent,
                args,
                context,
                info,
                'ObservationDefinition'
            );
        }
    },
    ObservationDefinition: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        validCodedValueSet: async (parent, args, context, info) => {
            return await findResourceByReference(parent.validCodedValueSet);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        normalCodedValueSet: async (parent, args, context, info) => {
            return await findResourceByReference(parent.normalCodedValueSet);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        abnormalCodedValueSet: async (parent, args, context, info) => {
            return await findResourceByReference(parent.abnormalCodedValueSet);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        criticalCodedValueSet: async (parent, args, context, info) => {
            return await findResourceByReference(parent.criticalCodedValueSet);
        },
    }
};
