const {search} = require('../../operations/search/search');
const {searchById} = require('../../operations/searchById/searchById');
const {unBundle} = require('../common');

module.exports = {
    Query: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        patients: async (parent, args, context, info) => {
            return unBundle(
                await (
                    search(
                        {
                            base_version: '4_0_0',
                            _bundle: '1',
                            ...args
                        },
                        context.user,
                        context.scope,
                        'Patient',
                        'Patient'
                    )
                )
            );
        },
        // noinspection JSUnusedLocalSymbols
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
            return unBundle(
                await (
                    search({
                        base_version: '4_0_0',
                        _bundle: '1',
                        'patient': parent.id,
                        ...args
                    }, context.user, context.scope, 'ExplanationOfBenefit', 'ExplanationOfBenefit')
                )
            );
        },
    },
};
