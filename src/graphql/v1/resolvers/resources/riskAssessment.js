// This code is generated by a code generator.  Do not edit.
/*eslint no-unused-vars: "off"*/
const {resolveType, findResourcesByReference, findResourceByReference, getResources} = require('../../common');

// noinspection JSUnusedLocalSymbols
module.exports = {
    Query: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        riskAssessment: async (parent, args, context, info) => {
            return await getResources(
                parent,
                args,
                context,
                info,
                'RiskAssessment'
            );
        }
    },
    RiskAssessmentSubject: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    RiskAssessmentPerformer: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    RiskAssessmentReasonReference: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    RiskAssessment: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        basedOn: async (parent, args, context, info) => {
            return await findResourceByReference(
                parent,
                args,
                context,
                info,
                parent.basedOn);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        parent: async (parent, args, context, info) => {
            return await findResourceByReference(
                parent,
                args,
                context,
                info,
                parent.parent);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        subject: async (parent, args, context, info) => {
            return await findResourceByReference(
                parent,
                args,
                context,
                info,
                parent.subject);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        encounter: async (parent, args, context, info) => {
            return await findResourceByReference(
                parent,
                args,
                context,
                info,
                parent.encounter);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        condition: async (parent, args, context, info) => {
            return await findResourceByReference(
                parent,
                args,
                context,
                info,
                parent.condition);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        performer: async (parent, args, context, info) => {
            return await findResourceByReference(
                parent,
                args,
                context,
                info,
                parent.performer);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        reasonReference: async (parent, args, context, info) => {
            return await findResourcesByReference(
                parent,
                args,
                context,
                info,
                parent.reasonReference);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        basis: async (parent, args, context, info) => {
            return await findResourcesByReference(
                parent,
                args,
                context,
                info,
                parent.basis);
        },
    }
};
