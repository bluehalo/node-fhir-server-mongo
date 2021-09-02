// This runs in a separate process to index so the main thread is not blocked
// from https://riptutorial.com/node-js/example/21833/processing-long-running-queries-with-node

const {indexAllCollections} = require('../utils/index.util');
const {logMessageToSlack} = require('../utils/slack.logger');


// eslint-disable-next-line no-unused-vars
process.on('message', async (message) => {
    console.log('==== Starting indexing in separate process ====');
    await logMessageToSlack('Starting indexing in separate process');
    //send status update to the main app
    process.send({status: 'We have started processing your data.'});

    try {
        const collection_stats = await indexAllCollections();
        await logMessageToSlack('Finished indexing in separate process');
        console.log(JSON.stringify(collection_stats));
        console.log('===== Done Indexing in separate process ======');
        await logMessageToSlack(JSON.stringify(collection_stats));
    } catch (e) {
        console.log('===== ERROR Indexing in separate process ======', e);
        console.log(JSON.stringify(e));
        await logMessageToSlack(JSON.stringify(e));
    }
    //notify node, that we are done with this task
    process.disconnect();
});

process.on('uncaughtException', function (err) {
    console.log('Error happened: ' + err.message + '\n' + err.stack + '.\n');
    console.log('Gracefully finish the routine.');
});
