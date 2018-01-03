const fhirServerCore = require('@asymmetrik/fhir-server-core');
const path = require('path');
const env = require('var');
const fhirServerConfig = require(path.resolve('./src/server-core.config'));
const asyncHandler = require(path.resolve('./src/lib/async-handler'));
const mongoClient = require(path.resolve('./src/lib/mongo'));
const globals = require(path.resolve('./src/globals'));

let main = async function () {
	// Connect to mongo
	let [ mongoErr, client ] = await asyncHandler(mongoClient());

	if (mongoErr) {
		console.error(mongoErr.message);
		process.exit(1);
	}

	// Save the client in another module so I can use it in my services
	globals.set('client', client);
	globals.set('client_db', client.db(env.MONGO_DB_NAME));

	// Start our FHIR server
	let [ serverErr, server ] = await asyncHandler(fhirServerCore(fhirServerConfig));

	if (serverErr) {
		console.error(serverErr.message);
		process.exit(1);
	}

	server.logger.info(`FHIR Server started on port ${fhirServerConfig.server.port}`);

};

main();
