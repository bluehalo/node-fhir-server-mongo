// This code is generated by a code generator.  Do not edit.
const {resolveType, findResourcesByReference, findResourceByReference, getResources} = require('../../common');

// noinspection JSUnusedLocalSymbols
module.exports = {
    Query: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        deviceMetric: async (parent, args, context, info) => {
            return await getResources(
                parent,
                args,
                context,
                info,
                'DeviceMetric'
            );
        }
    },
    DeviceMetric: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        source: async (parent, args, context, info) => {
            return await findResourceByReference(
                args,
                context,
                info,
                parent.source);
        },
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        parent: async (parent, args, context, info) => {
            return await findResourceByReference(
                args,
                context,
                info,
                parent.parent);
        },
    }
};

