// This code is generated by a code generator.  Do not edit.
const {search} = require('../../../operations/search/search');
const {searchById} = require('../../../operations/searchById/searchById');
const {unBundle, resolveType} = require('../../common');
const {NotFoundError} = require('../../../utils/httpErrors');

// noinspection JSUnusedLocalSymbols
module.exports = {
    Query: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        researchDefinition: async (parent, args, context, info) => {
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
                        'ResearchDefinition',
                        'ResearchDefinition'
                    )
                )
            );
        }
    },
    ResearchDefinition: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        subjectReference: async (parent, args, context, info) => {
            try {
                /**
                 * @type {string}
                 */
                const idOfReference = parent.patient.reference.split('/')[1];
                return searchById(
                    {base_version: '4_0_0', id: idOfReference},
                    context.user,
                    context.scope,
                    'Group',
                    'Group'
                );
            } catch (e) {
                if (e instanceof NotFoundError) {
                    return null;
                }
            }
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        population: async (parent, args, context, info) => {
            try {
                /**
                 * @type {string}
                 */
                const idOfReference = parent.patient.reference.split('/')[1];
                return searchById(
                    {base_version: '4_0_0', id: idOfReference},
                    context.user,
                    context.scope,
                    'ResearchElementDefinition',
                    'ResearchElementDefinition'
                );
            } catch (e) {
                if (e instanceof NotFoundError) {
                    return null;
                }
            }
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        exposure: async (parent, args, context, info) => {
            try {
                /**
                 * @type {string}
                 */
                const idOfReference = parent.patient.reference.split('/')[1];
                return searchById(
                    {base_version: '4_0_0', id: idOfReference},
                    context.user,
                    context.scope,
                    'ResearchElementDefinition',
                    'ResearchElementDefinition'
                );
            } catch (e) {
                if (e instanceof NotFoundError) {
                    return null;
                }
            }
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        exposureAlternative: async (parent, args, context, info) => {
            try {
                /**
                 * @type {string}
                 */
                const idOfReference = parent.patient.reference.split('/')[1];
                return searchById(
                    {base_version: '4_0_0', id: idOfReference},
                    context.user,
                    context.scope,
                    'ResearchElementDefinition',
                    'ResearchElementDefinition'
                );
            } catch (e) {
                if (e instanceof NotFoundError) {
                    return null;
                }
            }
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        outcome: async (parent, args, context, info) => {
            try {
                /**
                 * @type {string}
                 */
                const idOfReference = parent.patient.reference.split('/')[1];
                return searchById(
                    {base_version: '4_0_0', id: idOfReference},
                    context.user,
                    context.scope,
                    'ResearchElementDefinition',
                    'ResearchElementDefinition'
                );
            } catch (e) {
                if (e instanceof NotFoundError) {
                    return null;
                }
            }
        },
    }
};

