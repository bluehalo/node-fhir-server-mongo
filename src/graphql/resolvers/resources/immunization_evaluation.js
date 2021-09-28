// This code is generated by a code generator.  Do not edit.
const {search} = require('../../../operations/search/search');
const {searchById} = require('../../../operations/searchById/searchById');
const {unBundle} = require('../../common');
const {NotFoundError} = require('../../../utils/httpErrors');

module.exports = {
    Query: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        immunizationEvaluation: async (parent, args, context, info) => {
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
                        'ImmunizationEvaluation',
                        'ImmunizationEvaluation'
                    )
                )
            );
        }
    },
    ImmunizationEvaluation: {
        // noinspection JSUnusedLocalSymbols
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
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        authority: async (parent, args, context, info) => {
            try {
                /**
                 * @type {string}
                 */
                const idOfReference = parent.patient.reference.split('/')[1];
                return searchById(
                    {base_version: '4_0_0', id: idOfReference},
                    context.user,
                    context.scope,
                    'Organization',
                    'Organization'
                );
            } catch (e) {
                if (e instanceof NotFoundError) {
                    return null;
                }
            }
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        immunizationEvent: async (parent, args, context, info) => {
            try {
                /**
                 * @type {string}
                 */
                const idOfReference = parent.patient.reference.split('/')[1];
                return searchById(
                    {base_version: '4_0_0', id: idOfReference},
                    context.user,
                    context.scope,
                    'Immunization',
                    'Immunization'
                );
            } catch (e) {
                if (e instanceof NotFoundError) {
                    return null;
                }
            }
        },
    }
};

