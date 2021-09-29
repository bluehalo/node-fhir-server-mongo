// This code is generated by a code generator.  Do not edit.
const {resolveType, findResourcesByReference, findResourceByReference, getResources} = require('../../common');

// noinspection JSUnusedLocalSymbols
module.exports = {
    Query: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        researchDefinition: async (parent, args, context, info) => {
            return await getResources(
                parent,
                args,
                context,
                info,
                'ResearchDefinition'
            );
        }
    },
    ResearchDefinition: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        subjectReference: async (parent, args, context, info) => {
            return await findResourceByReference(parent.subjectReference);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        population: async (parent, args, context, info) => {
            return await findResourceByReference(parent.population);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        exposure: async (parent, args, context, info) => {
            return await findResourceByReference(parent.exposure);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        exposureAlternative: async (parent, args, context, info) => {
            return await findResourceByReference(parent.exposureAlternative);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        outcome: async (parent, args, context, info) => {
            return await findResourceByReference(parent.outcome);
        },
    }
};

