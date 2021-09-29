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
        group: async (parent, args, context, info) => {
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
                        'Group',
                        'Group'
                    )
                )
            );
        }
    },
    GroupManagingEntity: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    Group: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        managingEntity: async (parent, args, context, info) => {
            try {
                /**
                 * @type {string}
                 */
                const idOfReference = parent.patient.reference.split('/')[1];
                return searchById(
                    {base_version: '4_0_0', id: idOfReference},
                    context.user,
                    context.scope,
                    'Organization, RelatedPerson, Practitioner, PractitionerRole',
                    'Organization, RelatedPerson, Practitioner, PractitionerRole'
                );
            } catch (e) {
                if (e instanceof NotFoundError) {
                    return null;
                }
            }
        },
    }
};

