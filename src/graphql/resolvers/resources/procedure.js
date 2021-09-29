// This code is generated by a code generator.  Do not edit.
const {resolveType, findResourcesByReference, findResourceByReference, getResources} = require('../../common');

// noinspection JSUnusedLocalSymbols
module.exports = {
    Query: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        procedure: async (parent, args, context, info) => {
            return await getResources(
                parent,
                args,
                context,
                info,
                'Procedure'
            );
        }
    },
    ProcedureBasedOn: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    ProcedurePartOf: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    ProcedureSubject: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    ProcedureRecorder: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    ProcedureAsserter: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    ProcedureReasonReference: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    ProcedureReport: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    ProcedureUsedReference: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    Procedure: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        basedOn: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.basedOn);
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
        recorder: async (parent, args, context, info) => {
            return await findResourceByReference(parent.recorder);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        asserter: async (parent, args, context, info) => {
            return await findResourceByReference(parent.asserter);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        location: async (parent, args, context, info) => {
            return await findResourceByReference(parent.location);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        reasonReference: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.reasonReference);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        report: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.report);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        complicationDetail: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.complicationDetail);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        usedReference: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.usedReference);
        },
    }
};

