// This runs in a separate process to index so the main thread is not blocked
// from https://riptutorial.com/node-js/example/21833/processing-long-running-queries-with-node

const {indexAllCollections} = require('../utils/index.util');
const env = require('var');
const {WebClient} = require('@slack/web-api');

function logMessageToSlack(message) {
    if (env.SLACK_TOKEN && env.SLACK_CHANNEL) {
        const options = {token: env.SLACK_TOKEN, channel: env.SLACK_CHANNEL};
        (async () => {
            const web = new WebClient(options.token);
            // Post a message to the channel, and await the result.
            // Find more arguments and details of the response: https://api.slack.com/methods/chat.postMessage
            await web.chat.postMessage({
                text: message,
                channel: options.channel,
            });
        })();
    }
}

// eslint-disable-next-line no-unused-vars
process.on('message', function (message) {
    console.log('==== Starting indexing in separate process ====');
    logMessageToSlack('Starting indexing in separate process');
    //send status update to the main app
    process.send({status: 'We have started processing your data.'});

    (async () => {
        try {
            const collection_stats = await indexAllCollections();
            logMessageToSlack('Finished indexing in separate process');
            console.log(JSON.stringify(collection_stats));
            console.log('===== Done Indexing in separate process ======');
            logMessageToSlack(JSON.stringify(collection_stats));
        }
        catch (e) {
            console.log('===== ERROR Indexing in separate process ======', e);
            console.log(JSON.stringify(e));
            logMessageToSlack(JSON.stringify(e));
        }
        //notify node, that we are done with this task
        process.disconnect();
    })();
});

process.on('uncaughtException', function (err) {
    console.log('Error happened: ' + err.message + '\n' + err.stack + '.\n');
    console.log('Gracefully finish the routine.');
});
