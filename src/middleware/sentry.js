/**
 * 3rd party Error Tracking Middleware
 */
const Sentry = require('@sentry/node');
const {logErrorToSlack} = require('../utils/slack.logger');

Sentry.init({dsn: process.env.SENTRY_DSN});


process.on('uncaughtException', async (err) => {
    Sentry.captureException(err);
    await logErrorToSlack(err);
    process.exit(1);
});

process.on('unhandledRejection', async (err) => {
    Sentry.captureException(err);
    await logErrorToSlack(err);
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
