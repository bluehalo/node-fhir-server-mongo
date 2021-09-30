// This code is generated by a code generator.  Do not edit.
const {resolveType, findResourcesByReference, findResourceByReference, getResources} = require('../../common');

// noinspection JSUnusedLocalSymbols
module.exports = {
    Query: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        medicationStatement: async (parent, args, context, info) => {
            return await getResources(
                parent,
                args,
                context,
                info,
                'MedicationStatement'
            );
        }
    },
    MedicationStatementBasedOn: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    MedicationStatementPartOf: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    MedicationStatementSubject: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    MedicationStatementContext: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    MedicationStatementInformationSource: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    MedicationStatementReasonReference: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    MedicationStatement: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        basedOn: async (parent, args, context, info) => {
            return await findResourcesByReference(
                args,
                context,
                info,
                parent.basedOn);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        partOf: async (parent, args, context, info) => {
            return await findResourcesByReference(
                args,
                context,
                info,
                parent.partOf);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        medicationReference: async (parent, args, context, info) => {
            return await findResourceByReference(
                args,
                context,
                info,
                parent.medicationReference);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        subject: async (parent, args, context, info) => {
            return await findResourceByReference(
                args,
                context,
                info,
                parent.subject);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        context: async (parent, args, context, info) => {
            return await findResourceByReference(
                args,
                context,
                info,
                parent.context);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        informationSource: async (parent, args, context, info) => {
            return await findResourceByReference(
                args,
                context,
                info,
                parent.informationSource);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        derivedFrom: async (parent, args, context, info) => {
            return await findResourcesByReference(
                args,
                context,
                info,
                parent.derivedFrom);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        reasonReference: async (parent, args, context, info) => {
            return await findResourcesByReference(
                args,
                context,
                info,
                parent.reasonReference);
        },
    }
};

