/**
 * This file implements a background long running task to apply indexes to mongo db
 */

// This runs in a separate process to index so the main thread is not blocked
// from https://riptutorial.com/node-js/example/21833/processing-long-running-queries-with-node

const {indexAllCollections, deleteIndexesInAllCollections} = require('../indexes/index.util');
const {logMessageToSlack} = require('../utils/slack.logger');


// eslint-disable-next-line no-unused-vars
process.on('message', async (params) => {
    //send status update to the main app
    console.log('message:' + params);
    const message = params.message;
    process.send({status: 'We have started processing your data.'});

    try {
        if (message === 'Start Index') {
            console.log('==== Starting indexing in separate process ====');
            await logMessageToSlack('Starting indexing in separate process');
            const collection_stats = await indexAllCollections();
            await logMessageToSlack('Finished indexing in separate process');
            console.log(JSON.stringify(collection_stats));
            console.log('===== Done Indexing in separate process ======');
            await logMessageToSlack(JSON.stringify(collection_stats));
        } else if (message === 'Rebuild Index') {
            console.log('==== Starting deleting indexes in separate process ====');
            await logMessageToSlack('Starting deleting indexes in separate process');
            await deleteIndexesInAllCollections();
            await logMessageToSlack('Finished deleting index in separate process');
            console.log('===== Finished deleting index in separate process ======');
            await logMessageToSlack('Starting indexing in separate process');
            const collection_stats = await indexAllCollections();
            await logMessageToSlack('Finished indexing in separate process');
            console.log(JSON.stringify(collection_stats));
            console.log('===== Done Indexing in separate process ======');
            await logMessageToSlack(JSON.stringify(collection_stats));
        }
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
