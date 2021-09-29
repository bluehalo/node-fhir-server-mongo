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
        carePlan: async (parent, args, context, info) => {
            return await getResources(
                parent,
                args,
                context,
                info,
                'CarePlan'
            );
        }
    },
    CarePlanSubject: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    CarePlanAuthor: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    CarePlanContributor: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    CarePlan: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        basedOn: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.basedOn);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        replaces: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.replaces);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        partOf: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.partOf);
        },
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
        author: async (parent, args, context, info) => {
            return await findResourceByReference(parent.author);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        contributor: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.contributor);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        careTeam: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.careTeam);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        addresses: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.addresses);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        supportingInfo: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.supportingInfo);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        goal: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.goal);
        },
    }
};

