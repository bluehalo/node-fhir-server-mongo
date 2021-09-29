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
        medicationAdministration: async (parent, args, context, info) => {
            return await getResources(
                parent,
                args,
                context,
                info,
                'MedicationAdministration'
            );
        }
    },
    MedicationAdministrationPartOf: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    MedicationAdministrationSubject: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    MedicationAdministrationContext: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    MedicationAdministrationReasonReference: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    MedicationAdministration: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        partOf: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.partOf);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        medicationReference: async (parent, args, context, info) => {
            return await findResourceByReference(parent.medicationReference);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        subject: async (parent, args, context, info) => {
            return await findResourceByReference(parent.subject);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        context: async (parent, args, context, info) => {
            return await findResourceByReference(parent.context);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        supportingInformation: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.supportingInformation);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        reasonReference: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.reasonReference);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        request: async (parent, args, context, info) => {
            return await findResourceByReference(parent.request);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        device: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.device);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        eventHistory: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.eventHistory);
        },
    }
};

