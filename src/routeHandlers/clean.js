const env = require('var');
const asyncHandler = require('../lib/async-handler');
const mongoClient = require('../lib/mongo');
const {mongoConfig} = require('../config');
module.exports.handleClean = async (req, res) => {
    // const query_args_array = Object.entries(req.query);
    // return res.status(200).json(req.params);
    if (!env.DISABLE_CLEAN_ENDPOINT) {
        console.info('Running clean');

        // Connect to mongo and pass any options here
        let [mongoError, client] = await asyncHandler(
            mongoClient(mongoConfig.connection, mongoConfig.options)
        );
        if (mongoError) {
            console.error(mongoError.message);
            console.error(mongoConfig.connection);
            client.close();
            res.status(500).json({success: false, error: mongoError});
        } else {
            //create client by providing database name
            const db = client.db(mongoConfig.db_name);
            let collection_names = [];
            // const collections = await db.listCollections().toArray();

            const specific_collection = req.params['collection'];
            console.log('specific_collection: ' + specific_collection);
            if (env.IS_PRODUCTION && !specific_collection) {
                return res.status(400).json({message: 'IS_PRODUCTION env var is set so you must pass a specific collection to clean'});
            }

            await db.listCollections().forEach(collection => {
                console.log(collection.name);
                if (collection.name.indexOf('system.') === -1) {
                    if (
                        !specific_collection || (
                            collection.name === (specific_collection + '_4_0_0') || collection.name === (specific_collection + '_4_0_0_History')
                        )
                    ) {
                        collection_names.push(collection.name);
                    }
                }
            });

            console.info('Collection_names:' + collection_names);
            for (const collection_index in collection_names) {
                const collection_name = collection_names[parseInt(collection_index)];
                console.log(collection_name);
                console.log(['Removing: ', await db.collection(collection_name).countDocuments({}), ' documents from ', collection_name].join(''));
                await db.collection(collection_name).deleteMany({});
            }
            await client.close();
            res.status(200).json({success: true, collections: collection_names});
        }
    } else {
        res.status(403).json();
    }
};
