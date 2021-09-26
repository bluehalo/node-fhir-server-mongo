// const {patients, explanationOfBenefits} = require('../fakedata');
const {search} = require('../../operations/search/search');
const {searchById} = require('../../operations/searchById/searchById');

module.exports = {
    Query: {
        // eslint-disable-next-line no-unused-vars
        explanationOfBenefits: async (parent, args, context, info) => {
            return search({base_version: '4_0_0'}, context.user, context.scope, 'ExplanationOfBenefit', 'ExplanationOfBenefit');
        },
        // eslint-disable-next-line no-unused-vars
        explanationOfBenefit: async (parent, args, context, info) => {
            return searchById({base_version: '4_0_0'}, context.user, context.scope, 'ExplanationOfBenefit', 'ExplanationOfBenefit');
        },
    },
    ExplanationOfBenefit: {
        // // eslint-disable-next-line no-unused-vars
        // patient: async (parent, args, context, info) => {
        //     return patients.filter(x => x.id === parent.patient_reference)[0];
        // }
    },
};
