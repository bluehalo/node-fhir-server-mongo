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
        testReport: async (parent, args, context, info) => {
            return await getResources(
                parent,
                args,
                context,
                info,
                'TestReport'
            );
        }
    },
    TestReport: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        testScript: async (parent, args, context, info) => {
            return await findResourceByReference(parent.testScript);
        },
    }
};

