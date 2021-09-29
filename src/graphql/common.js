/**
 * This functions takes a FHIR Bundle and returns the resources in it
 * @param bundle
 * @return {Resource}
 */
module.exports.unBundle = (bundle) => {
    return bundle.entry.map(e => e.resource);
};

// noinspection JSUnusedLocalSymbols
/**
 * This is to handle unions in GraphQL
 * @param obj
 * @param context
 * @param info
 * @return {null|*}
 */
// eslint-disable-next-line no-unused-vars
module.exports.resolveType = (obj, context, info) => {
    if (obj) {
        return obj.resourceType;
    }
    return null; // GraphQLError is thrown
};
