// This code is generated by a code generator.  Do not edit.
/*eslint no-unused-vars: "off"*/
const {resolveType, findResourcesByReference, findResourceByReference, getResources} = require('../../common');

// noinspection JSUnusedLocalSymbols
module.exports = {
    DetectedIssueEvidence: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        detail: async (parent, args, context, info) => {
            return await findResourcesByReference(
                parent,
                args,
                context,
                info,
                parent.detail);
        },
    }
};
