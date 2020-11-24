const express = require('express');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const globals = require('./globals');
const { CLIENT_DB } = require('./constants');

const { fhirServerConfig } = require('./config');

const app = express();
const fhirApp = FHIRServer.initialize(fhirServerConfig);

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use(fhirApp.app);

app.post('/clean', (req, res) => {
    let db = globals.get(CLIENT_DB);
    var collections = [];
    db.getCollectionNames().forEach(function (collection_name) {
        if (collection_name.indexOf('system.') === -1) {
            console.log(['Removing: ', db[collection_name].count({}), ' documents from ', collection_name].join(''));
            db[collection_name].deleteMany({});
            collections.push(collection_name);
        }
    });
    res.status(200).json({ success: true, collections: collections });
});

module.exports = { app, fhirApp };
