const {RequestInfo} = require('../utils/requestInfo');
/**
 * @param context
 * @returns {RequestInfo}
 */
module.exports.getRequestInfo = (context) => {
    return new RequestInfo(
        context.user,
        context.scope,
        context.remoteIpAddress,
        context.protocol,
        context.originalUrl,
        context.path,
        context.host,
        context.body
    );
};
