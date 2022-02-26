// This code is generated by a code generator.  Do not edit.
/*eslint no-unused-vars: "off"*/
const {resolveType, findResourcesByReference, findResourceByReference, getResources} = require('../../common');

// noinspection JSUnusedLocalSymbols
module.exports = {
    Query: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        schedule: async (parent, args, context, info) => {
            return await getResources(
                parent,
                args,
                context,
                info,
                'Schedule'
            );
        }
    },
    ScheduleActor: {
        __resolveType(obj, context, info) {
            return resolveType(obj, context, info);
        },
    },
    Schedule: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        actor: async (parent, args, context, info) => {
            return await findResourcesByReference(
                parent,
                args,
                context,
                info,
                parent.actor);
        },
    }
};
