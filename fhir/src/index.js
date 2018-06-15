const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const asyncHandler = require('./lib/async-handler');
const mongoClient = require('./lib/mongo');
const globals = require('./globals');

const {
	fhirServerConfig,
	mongoConfig
} = require('./config');

const {
	CLIENT,
	CLIENT_DB
} = require('./constants');

let main = async function () {
	// Connect to mongo and pass any options here
	let [ mongoErr, client ] = await asyncHandler(
		mongoClient(mongoConfig.connection, mongoConfig.options)
	);

	if (mongoErr) {
		console.error(mongoErr.message);
		process.exit(1);
	}

	// Save the client in another module so I can use it in my services
	globals.set(CLIENT, client);
	globals.set(CLIENT_DB, client.db(mongoConfig.db_name));

	// Start our FHIR server
	// let [ serverErr, server ] = await asyncHandler(fhirServerCore(fhirServerConfig));

    let server = FHIRServer.initialize(fhirServerConfig);
    server.listen(3000, () => server.logger.verbose('Server is up and running!'));

	// if (serverErr) {
	// 	console.error(serverErr.message);
	// 	process.exit(1);
	// }
    //
	// server.logger.info('FHIR Server successfully started.');
};

main();
