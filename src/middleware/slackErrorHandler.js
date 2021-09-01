const {WebClient} = require('@slack/web-api');
const env = require('var');


function getRemoteAddress(req) {
    return req['x-real-ip'] || req.ip || req._remoteAddress || req.connection && req.connection.remoteAddress || undefined;
}

function createCodeBlock(title, code) {
    // if (_.isEmpty(code)) return '';
    code = typeof code === 'string' ? code.trim() : JSON.stringify(code, null, 2);
    const tripleBackticks = '```';
    return '_' + title + '_' + tripleBackticks + code + tripleBackticks + '\n';
}

const sendErrorToSlack = (token, channel, err, req) => {
    const web = new WebClient(token);
    const request = {
        method: req.method,
        url: req.url,
        headers: req.headers,
        query: req.query,
        body: req.body || {}
    };
    const attachment = {
        fallback: 'FHIR Server Error',
        color: err.statusCode < 500 ? 'warning' : 'danger',
        author_name: req.headers.host,
        title: 'FHIR Server Error',
        fields: [{title: 'Request URL', value: req.url, short: true}, {
            title: 'Request Method',
            value: req.method,
            short: true
        }, {title: 'Status Code', value: err.statusCode, short: true}, {
            title: 'Remote Address',
            value: getRemoteAddress(req),
            short: true
        }],
        text: [{title: 'Stack trace:', code: err.stack}, {
            title: 'Request',
            code: request
        }].map(function (data) {
            return createCodeBlock(data.title, data.code);
        }).join(''),
        mrkdwn_in: ['text'],
        footer: 'express-errors-to-slack',
        ts: parseInt(Date.now() / 1000)
    };
    (async () => {
        // console.log(`Sending error message ${attachment} in channel ${channel}`);

        // Post a message to the channel, and await the result.
        // Find more arguments and details of the response: https://api.slack.com/methods/chat.postMessage
        const result = await web.chat.postMessage({
            text: attachment.fallback,
            attachments: [attachment],
            channel: channel,
        });

        // The result contains an identifier for the message, `ts`.
        console.log(`Successfully sent error message ${result.ts} in channel ${channel}`);
    })();
};

const slackErrorHandler = (err, req, res, next) => {
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
        sendErrorToSlack(options.token, options.channel, err, req);
        next(err);
    }
};

module.exports.slackErrorHandler = slackErrorHandler;
