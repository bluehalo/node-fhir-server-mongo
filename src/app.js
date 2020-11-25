const express = require('express');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const asyncHandler = require('./lib/async-handler');
const mongoClient = require('./lib/mongo');
const { fhirServerConfig, mongoConfig } = require('./config');

const app = express();
const fhirApp = FHIRServer.initialize(fhirServerConfig);

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.get('/clean', async (req, res) => {
    console.info('Running clean');

    // Connect to mongo and pass any options here
    let [mongoError, client] = await asyncHandler(
        mongoClient(mongoConfig.connection, mongoConfig.options)
    );
    if (mongoError) {
        console.error(mongoError.message);
        console.error(mongoConfig.connection);
        client.close();
        res.status(500).json({ success: false, error: mongoError });
    }
    else {
        //create client by providing database name
        const db = client.db(mongoConfig.db_name);
        var collection_names = [];
        // const collections = await db.listCollections().toArray();

        await db.listCollections().forEach(async collection => {
            console.log(collection.name);
            if (collection.name.indexOf('system.') === -1) {
                collection_names.push(collection.name);
            }
        });

        console.info('Collection_names:' + collection_names);
        for (const collection_index in collection_names){
            const collection_name = collection_names[collection_index];
            console.log(collection_name);
            console.log(['Removing: ', await db.collection(collection_name).countDocuments({}), ' documents from ', collection_name].join(''));
            await db.collection(collection_name).deleteMany({});
        }
        await client.close();
        res.status(200).json({ success: true, collections: collection_names });
    }
});

app.use(fhirApp.app);


module.exports = { app, fhirApp };
