// ------ This code is generated by a code generator.  Do not edit. ------


// noinspection JSUnusedLocalSymbols
module.exports = {
    PatientLinkOther: {
        __resolveType(obj, context, info) {
            return context.dataApi.resolveType(obj, context, info);
        },
    },
    PatientLink: {
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line no-unused-vars
        other: async (parent, args, context, info) => {
            return await context.dataApi.findResourceByReference(
                parent,
                args,
                context,
                info,
                parent.other);
        },
    }
};

