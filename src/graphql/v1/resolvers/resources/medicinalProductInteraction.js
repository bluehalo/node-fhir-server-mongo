// This code is generated by a code generator.  Do not edit.
/*eslint no-unused-vars: "off"*/
const {resolveType, findResourcesByReference, findResourceByReference, getResources} = require('../../common');

// noinspection JSUnusedLocalSymbols
module.exports = {
    Query: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        medicinalProductInteraction: async (parent, args, context, info) => {
            return await getResources(
                parent,
                args,
                context,
                info,
                'MedicinalProductInteraction'
            );
        }
    },
    MedicinalProductInteractionSubject: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    MedicinalProductInteraction: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        subject: async (parent, args, context, info) => {
            return await findResourcesByReference(
                parent,
                args,
                context,
                info,
                parent.subject);
        },
    }
};
