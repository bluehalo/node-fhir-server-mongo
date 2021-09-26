const {patients, explanationOfBenefits} = require('../fakedata');
const {search} = require('../../operations/search/search');

module.exports = {
    Query: {
        // eslint-disable-next-line no-unused-vars
        explanationOfBenefits: async (parent, args, context, info) => {
            return search({base_version: '4_0_0'}, context.user, context.scope, 'ExplanationOfBenefit', 'ExplanationOfBenefit');
        },
        // eslint-disable-next-line no-unused-vars
        explanationOfBenefit: async (parent, args, context, info) => {
            return explanationOfBenefits.filter(x => x.id === args.id)[0];
        },
    },
    ExplanationOfBenefit: {
        // eslint-disable-next-line no-unused-vars
        patient: async (parent, args, context, info) => {
            return patients.filter(x => x.id === parent.patient_reference)[0];
        }
    },
};
