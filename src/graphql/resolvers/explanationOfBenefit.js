const {search} = require('../../operations/search/search');
const {searchById} = require('../../operations/searchById/searchById');
const {NotFoundError} = require('../../utils/httpErrors');
const {unBundle} = require('../common');

module.exports = {
    Query: {
        // eslint-disable-next-line no-unused-vars
        explanationOfBenefits: async (parent, args, context, info) => {
            return unBundle(
                await search(
                    {
                        base_version: '4_0_0',
                        _bundle: '1',
                        ...args
                    },
                    context.user,
                    context.scope,
                    'ExplanationOfBenefit',
                    'ExplanationOfBenefit'
                ));
        },
        // eslint-disable-next-line no-unused-vars
        explanationOfBenefit: async (parent, args, context, info) => {
            return searchById({
                base_version: '4_0_0',
                id: args.id
            }, context.user, context.scope, 'ExplanationOfBenefit', 'ExplanationOfBenefit');
        },
    },
    ExplanationOfBenefitProvider: {
        // noinspection JSUnusedGlobalSymbols
        // eslint-disable-next-line no-unused-vars
        __resolveType(obj, context, info) {
            if (obj) {
                return obj.resourceType;
            }
            return null; // GraphQLError is thrown
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
        },
        // eslint-disable-next-line no-unused-vars
        provider: async (parent, args, context, info) => {
            try {
                /**
                 * @type {string}
                 */
                const typeOfReference = parent.provider.reference.split('/')[0];
                /**
                 * @type {string}
                 */
                const idOfReference = parent.provider.reference.split('/')[1];
                if (typeOfReference !== 'Practitioner' && typeOfReference !== 'Organization') {
                    return null;
                }
                return await searchById(
                    {base_version: '4_0_0', id: idOfReference},
                    context.user,
                    context.scope,
                    typeOfReference,
                    typeOfReference
                );
            } catch (e) {
                if (e instanceof NotFoundError) {
                    return null;
                }
            }
        },
    },
};
