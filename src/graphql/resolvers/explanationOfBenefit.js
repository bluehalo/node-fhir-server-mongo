// const {patients, explanationOfBenefits} = require('../fakedata');
const {search} = require('../../operations/search/search');
const {searchById} = require('../../operations/searchById/searchById');
const {NotFoundError} = require('../../utils/httpErrors');

module.exports = {
    Query: {
        // eslint-disable-next-line no-unused-vars
        explanationOfBenefits: async (parent, args, context, info) => {
            return search({base_version: '4_0_0'}, context.user, context.scope, 'ExplanationOfBenefit', 'ExplanationOfBenefit');
        },
        // eslint-disable-next-line no-unused-vars
        explanationOfBenefit: async (parent, args, context, info) => {
            return searchById({
                base_version: '4_0_0',
                id: args.id
            }, context.user, context.scope, 'ExplanationOfBenefit', 'ExplanationOfBenefit');
        },
    },
    ExplanationOfBenefit: {
        // eslint-disable-next-line no-unused-vars
        patient: async (parent, args, context, info) => {
            try {
                /**
                 * @type {string}
                 */
                const idOfReference = parent.patient.reference.split('/')[1];
                return searchById(
                    {base_version: '4_0_0', id: idOfReference},
                    context.user,
                    context.scope,
                    'Patient',
                    'Patient'
                );
            } catch (e) {
                if (e instanceof NotFoundError) {
                    return null;
                }
            }
        }
    },
};
