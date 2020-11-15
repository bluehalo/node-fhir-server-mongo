const { app, fhirApp } = require('./app');

const asyncHandler = require('./lib/async-handler');
const mongoClient = require('./lib/mongo');
const globals = require('./globals');
const { fhirServerConfig, mongoConfig } = require('./config');
const { CLIENT, CLIENT_DB } = require('./constants');

const main = async function () {
  // Connect to mongo and pass any options here
  let [mongoErr, client] = await asyncHandler(
    mongoClient(mongoConfig.connection, mongoConfig.options)
  );

  if (mongoErr) {
    console.error(mongoErr.message);
    console.error(mongoConfig.connection);
    process.exit(1);
  }

  globals.set(CLIENT, client);
  globals.set(CLIENT_DB, client.db(mongoConfig.db_name));

  app.listen(fhirServerConfig.server.port, () =>
    fhirApp.logger.verbose('Server is up and running!')
  );
};

main();
