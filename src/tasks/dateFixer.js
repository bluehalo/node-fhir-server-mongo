/**
 * This file implements a background long running task to apply indexes to mongo db
 */

// This runs in a separate process to index so the main thread is not blocked
// from https://riptutorial.com/node-js/example/21833/processing-long-running-queries-with-node

const {logMessageToSlack} = require('../utils/slack.logger');
const {fixLastUpdatedDatesInAllCollections} = require('../indexes/dateFixer');


// eslint-disable-next-line no-unused-vars
process.on('message', async (params) => {
    //send status update to the main app
    console.log('message:' + params);
    const message = params.message;
    const tableNamesCsv = params.tableNamesCsv;
    const batchSize = params.batchSize;
    process.send({status: 'We have started processing your data.'});

    try {
        if (message === 'Fix Dates') {
            const message1 = `Starting fixing dates in separate process for ${tableNamesCsv}`;
            await logMessageToSlack(message1);
            console.log(`===== ${message1} ======`);
            await fixLastUpdatedDatesInAllCollections(tableNamesCsv ? tableNamesCsv.split(',') : [], batchSize);
            const message2 = 'Finished fixing dates in separate process';
            await logMessageToSlack(message2);
            console.log(`===== ${message2} ======`);
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
