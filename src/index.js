const fhirServerCore = require('@asymmetrik/fhir-server-core');
const asyncHandler = require('./lib/async-handler');
const mongoClient = require('./lib/mongo');
const globals = require('./globals');
const {
	fhirServerConfig,
	mongoConfig
} = require('./config');

let main = async function () {
	// Connect to mongo and pass any options here
	let [ mongoErr, client ] = await asyncHandler(mongoClient(mongoConfig.connection, mongoConfig.options));

	if (mongoErr) {
		console.error(mongoErr.message);
		process.exit(1);
	}

	// Save the client in another module so I can use it in my services
	globals.set('client', client);
	globals.set('client_db', client.db(mongoConfig.db_name));

	// Start our FHIR server
	let [ serverErr, server ] = await asyncHandler(fhirServerCore(fhirServerConfig));

	if (serverErr) {
		console.error(serverErr.message);
		process.exit(1);
	}

	server.logger.info('FHIR Server successfully started.');

};

main();
