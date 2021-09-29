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
        messageHeader: async (parent, args, context, info) => {
            return await getResources(
                parent,
                args,
                context,
                info,
                'MessageHeader'
            );
        }
    },
    MessageHeaderSender: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    MessageHeaderEnterer: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    MessageHeaderAuthor: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    MessageHeaderResponsible: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    MessageHeader: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        sender: async (parent, args, context, info) => {
            return await findResourceByReference(parent.sender);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        enterer: async (parent, args, context, info) => {
            return await findResourceByReference(parent.enterer);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        author: async (parent, args, context, info) => {
            return await findResourceByReference(parent.author);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        responsible: async (parent, args, context, info) => {
            return await findResourceByReference(parent.responsible);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        focus: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.focus);
        },
    }
};

