const {search} = require('../../operations/search/search');
const {searchById} = require('../../operations/searchById/searchById');

module.exports = {
    Query: {
        // eslint-disable-next-line no-unused-vars
        patients: async (parent, args, context, info) => {
            return search({base_version: '4_0_0'}, context.user, context.scope, 'Patient', 'Patient');
        },
        // eslint-disable-next-line no-unused-vars
        patient: async (parent, args, context, info) => {
            return searchById({
                base_version: '4_0_0',
                id: args.id
            }, context.user, context.scope, 'Patient', 'Patient');

        },
    },
    Patient: {
        // eslint-disable-next-line no-unused-vars
        explanationOfBenefit: async (parent, args, context, info) => {
            return search({
                base_version: '4_0_0',
                'patient': parent.id
            }, context.user, context.scope, 'ExplanationOfBenefit', 'ExplanationOfBenefit');
        },
    },
};
