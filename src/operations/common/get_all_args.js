const {logDebug} = require('./logging');

/**
 * combines args with args from request
 * @param {IncomingMessage} req
 * @param {string[]} args
 * @returns {string[]} array of combined arguments
 */
module.exports.get_all_args = (req, args) => {
    // asymmetric hides certain query parameters from us so we need to get them from the context
    const query_param_args = {};
    /**
     * args array
     * @type {[string][]}
     */
    const query_args_array = Object.entries(req.query);
    query_args_array.forEach(x => {
        query_param_args[x[0]] = x[1];
    });

    const sanitized_args = {};
    const sanitized_args_array = Object.entries(req.sanitized_args);
    sanitized_args_array.forEach(x => {
        sanitized_args[x[0]] = x[1];
    });

    /**
     * combined args
     * @type {string[]}
     */
    const combined_args = Object.assign({}, args, sanitized_args, query_param_args);
    logDebug(req.user, '---- combined_args ----');
    logDebug(req.user, JSON.stringify(combined_args));
    logDebug(req.user, '--------');
    return combined_args;
};
