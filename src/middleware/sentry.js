/**
 * 3rd party Error Tracking Middleware
 */
const Sentry = require('@sentry/node');
const {WebClient} = require('@slack/web-api');
const env = require('var');

Sentry.init({dsn: process.env.SENTRY_DSN});

function logErrorToSlack(err) {
    if (env.SLACK_TOKEN && env.SLACK_CHANNEL) {
        const options = {token: env.SLACK_TOKEN, channel: env.SLACK_CHANNEL};
        (async () => {
            const web = new WebClient(options.token);
            // Post a message to the channel, and await the result.
            // Find more arguments and details of the response: https://api.slack.com/methods/chat.postMessage
            await web.chat.postMessage({
                text: err.stack,
                channel: options.channel,
            });
        })();
    }
}

process.on('uncaughtException', (err) => {
    Sentry.captureException(err);
    logErrorToSlack(err);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    Sentry.captureException(err);
    logErrorToSlack(err);
    process.exit(1);
});

process.on('exit', function (code) {
    if (code !== 0) {
        const stack = new Error().stack;
        console.log('===== PROCESS EXIT ======');
        console.log('exit code:', code);
        console.log(stack);
    }
});

module.exports = Sentry;
