// This code is generated by a code generator.  Do not edit.
const {resolveType, findResourcesByReference, findResourceByReference, getResources} = require('../../common');

// noinspection JSUnusedLocalSymbols
module.exports = {
    Query: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        practitionerRole: async (parent, args, context, info) => {
            return await getResources(
                parent,
                args,
                context,
                info,
                'PractitionerRole'
            );
        }
    },
    PractitionerRole: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        practitioner: async (parent, args, context, info) => {
            return await findResourceByReference(parent.practitioner);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        organization: async (parent, args, context, info) => {
            return await findResourceByReference(parent.organization);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        location: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.location);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        healthcareService: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.healthcareService);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        endpoint: async (parent, args, context, info) => {
            return await findResourcesByReference(parent.endpoint);
        },
    }
};

