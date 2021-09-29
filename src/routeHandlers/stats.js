const asyncHandler = require('../lib/async-handler');
const mongoClient = require('../lib/mongo');
const {mongoConfig} = require('../config');
const async = require('async');
const env = require('var');

module.exports.handleStats = async (req, res) => {
    console.info('Running stats');

    // Connect to mongo and pass any options here
    let [mongoError, client] = await asyncHandler(
        mongoClient(mongoConfig.connection, mongoConfig.options)
    );

    /**
     * gets stats for a collection
     * @param {string} collection_name
     * @param {import('mongodb').Db} db
     * @return {Promise<{name, count: *}>}
     */
    async function getStatsForCollection(collection_name, db) {
        console.log(collection_name);
        const count = await db.collection(collection_name).estimatedDocumentCount();
        console.log(['Found: ', count, ' documents in ', collection_name].join(''));
        return {name: collection_name, count: count};
    }

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

        await db.listCollections().forEach(collection => {
            console.log(collection.name);
            if (collection.name.indexOf('system.') === -1) {
                collection_names.push(collection.name);
            }
        });

        console.info('Collection_names:' + collection_names);
        const collection_stats = await async.map(
            collection_names,
            async collection_name => await getStatsForCollection(collection_name, db)
        );
        await client.close();
        res.status(200).json({
            success: true,
            image: env.DOCKER_IMAGE || '',
            database: mongoConfig.db_name,
            collections: collection_stats
        });
    }
};
