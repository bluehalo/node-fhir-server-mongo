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
        patient: async (parent, args, context, info) => {
            return await getResources(
                parent,
                args,
                context,
                info,
                'Patient'
            );
        }
    },
    PatientGeneralPractitioner: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    Patient: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        generalPractitioner: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.generalPractitioner);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        managingOrganization: async (parent, args, context, info) => {
            return await findResourceByReference(parent.managingOrganization);
        },
    }
};

