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
        condition: async (parent, args, context, info) => {
            return await getResources(
                parent,
                args,
                context,
                info,
                'Condition'
            );
        }
    },
    ConditionSubject: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    ConditionRecorder: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    ConditionAsserter: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    Condition: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        subject: async (parent, args, context, info) => {
            return await findResourceByReference(parent.subject);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        encounter: async (parent, args, context, info) => {
            return await findResourceByReference(parent.encounter);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        recorder: async (parent, args, context, info) => {
            return await findResourceByReference(parent.recorder);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        asserter: async (parent, args, context, info) => {
            return await findResourceByReference(parent.asserter);
        },
    }
};

