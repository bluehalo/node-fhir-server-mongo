/**
 * This middleware sends error messages to a Slack channel
 */

const env = require('var');
const {logErrorAndRequestToSlack} = require('../utils/slack.logger');

const slackErrorHandler = async (err, req, res, next) => {
    // console.log('env.SLACK_STATUS_CODES_TO_IGNORE', env.SLACK_STATUS_CODES_TO_IGNORE);
    /**
     * status codes to ignore
     * @type {number[]}
     */
    const statusCodeToIgnore = env.SLACK_STATUS_CODES_TO_IGNORE ? env.SLACK_STATUS_CODES_TO_IGNORE.split(',').map(x => parseInt(x)) : [401, 404];
    // console.log('slackErrorHandler', err);
    if (statusCodeToIgnore.includes(err.statusCode)) {
        next(err);
    } else {
        console.log('slackErrorHandler logging', err);
        const options = {token: env.SLACK_TOKEN, channel: env.SLACK_CHANNEL};
        err.statusCode = err.statusCode || 500;
        // if (skip !== false && skip(err, req, res)) return next(err);
        await logErrorAndRequestToSlack(options.token, options.channel, err, req);
        next(err);
    }
};

module.exports.slackErrorHandler = slackErrorHandler;
