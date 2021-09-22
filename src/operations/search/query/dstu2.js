/**
 * Builds a mongo query for search parameters
 * @param {string[]} args
 * @returns {Object}
 */
module.exports.buildDstu2SearchQuery = (args) => {
    // Common search params
    let {id} = args;

    // Search Result params

    // Patient search params
    let active = args['active'];

    let query = {};
    if (id) {
        query.id = id;
    }

    if (active) {
        query.active = active === 'true';
    }
    return query;
};
