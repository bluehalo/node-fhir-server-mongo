/**
 * This route handler implements the /index route which is used to check current mongo indexes and add new ones
 */

const asyncHandler = require('../lib/async-handler');
const mongoClient = require('../lib/mongo');
const {mongoConfig} = require('../config');
// eslint-disable-next-line security/detect-child-process
const childProcess = require('child_process');
const {getIndexesInAllCollections, deleteIndexesInAllCollections} = require('../indexes/index.util');

module.exports.handleIndex = async (req, res) => {
    // console.info('Running index');

    // Connect to mongo and pass any options here
    let [mongoError, client] = await asyncHandler(
        mongoClient(mongoConfig.connection, mongoConfig.options)
    );
    if (mongoError) {
        console.error(mongoError.message);
        console.error(mongoConfig.connection);
        await client.close();
        res.status(500).json({success: false, error: mongoError});
    } else {
        await client.close();

        const operation = req.params['op'];
        console.log('runIndex: ' + JSON.stringify(req.params));
        console.log('runIndex: ' + operation);

        let message = '';
        let collection_stats = {};
        if (operation === 'run') {
            //create new instance of node for running separate task in another thread
            const taskProcessor = childProcess.fork('./src/tasks/indexer.js');
            //send some params to our separate task
            const params = {
                message: 'Start Index'
            };
            taskProcessor.send(params);
            message = 'Started indexing in separate process.  Check logs or Slack for output.';
        } else if (operation === 'delete') {
            // await deleteIndexesInAllCollections();
            //create new instance of node for running separate task in another thread
            const taskProcessor = childProcess.fork('./src/tasks/indexer.js');
            //send some params to our separate task
            const params = {
                message: 'Delete Index'
            };
            taskProcessor.send(params);
            message = 'Started deleting indexes in separate process.  Check logs or Slack for output.';
        } else {
            collection_stats = await getIndexesInAllCollections();
            message = 'Listing current indexes.  Use /index/run if you want to run index creation';
        }

        console.log(message);

        res.status(200).json({
            success: true,
            collections: collection_stats,
            message: message
        });
    }
};
