const asyncHandler = require('../lib/async-handler');
const mongoClient = require('../lib/mongo');
const {mongoConfig} = require('../config');
// eslint-disable-next-line security/detect-child-process
const childProcess = require('child_process');
const {getIndexesInAllCollections} = require('../indexes/index.util');

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

        const runIndex = req.params['run'];
        // console.log('runIndex: ' + runIndex);

        let collection_stats = {};
        if (runIndex) {
            //create new instance of node for running separate task in another thread
            const taskProcessor = childProcess.fork('./src/tasks/indexer.js');
            //send some params to our separate task
            const params = {
                message: 'Start Index'
            };

            taskProcessor.send(params);
        } else {
            collection_stats = await getIndexesInAllCollections();
        }


        res.status(200).json({
            success: true,
            collections: collection_stats,
            message: runIndex ? 'Started index creation in separate process.  Check logs or Slack for output.' : 'Listing current indexes.  Use /index/run if you want to run index creation'
        });
    }
};
