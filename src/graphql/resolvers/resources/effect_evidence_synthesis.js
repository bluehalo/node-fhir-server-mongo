// This code is generated by a code generator.  Do not edit.
const {search} = require('../../../operations/search/search');
const {searchById} = require('../../../operations/searchById/searchById');
const {unBundle, resolveType, findResourcesByReference, findResourceByReference, getResources} = require('../../common');
const {NotFoundError} = require('../../../utils/httpErrors');

// noinspection JSUnusedLocalSymbols
module.exports = {
    Query: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        effectEvidenceSynthesis: async (parent, args, context, info) => {
            return await getResources(
                parent,
                args,
                context,
                info,
                'EffectEvidenceSynthesis'
            );
        }
    },
    EffectEvidenceSynthesis: {
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

