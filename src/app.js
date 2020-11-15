const express = require('express');
const FHIRServer = require('@asymmetrik/node-fhir-server-core');

const { fhirServerConfig } = require('./config');

const app = express();
const fhirApp = FHIRServer.initialize(fhirServerConfig);

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use(fhirApp.app);

module.exports = { app, fhirApp };
