const path = require('path');
const env = require('var');

/**
 * @name mongoConfig
 * @summary Configurations for our Mongo instance
 */
let mongoConfig = {
	connection: `mongodb://${env.MONGO_HOSTNAME}`,
	db_name: env.MONGO_DB_NAME,
	options: {
		auto_reconnect: true
	}
};

// Set up whitelist
let whitelist_env = env.WHITELIST && env.WHITELIST.split(',').map(host => host.trim()) || false;

// If no whitelist is present, disable cors
// If it's length is 1, set it to a string, so * works
// If there are multiple, keep them as an array
let whitelist = whitelist_env && whitelist_env.length === 1
	? whitelist_env[0]
	: whitelist_env;

/**
 * @name fhirServerConfig
 * @summary @asymmetrik/node-fhir-server-core configurations.
 */
let fhirServerConfig = {
	auth: {
		resourceServer: env.RESOURCE_SERVER,
		service: path.resolve('./src/services/oauth/oauth.validator.js'),
	},
	server: {
		// support various ENV that uses PORT vs SERVER_PORT
		port: env.PORT || env.SERVER_PORT,
		// allow Access-Control-Allow-Origin
		corsOptions: {
			maxAge: 86400,
			origin: whitelist
		}
	},
	logging: {
		level: env.LOGGING_LEVEL
	},
	security: [
		{
			url: 'authorize',
			valueUri: `${env.AUTH_SERVER_URI}/authorize`
		},
		{
			url: 'token',
			valueUri: `${env.AUTH_SERVER_URI}/token`
		}
		// optional - registration
	],
	profiles: {
		dstu2: {
			patient: {
				service: path.resolve('./src/services/patient/patient.service.js')
			},
			observation: {
				service: path.resolve('./src/services/observation/observation.service.js')
			},
			oauth: {
				service: path.resolve('./src/services/oauth/oauth.service.js')
			}
		}
	}
};

if (env.SSL_KEY && env.SSL_CERT) {
	fhirServerConfig.server.ssl = {
		key: path.resolve(env.SSL_KEY),
		cert: path.resolve(env.SSL_CERT)
	};
}

module.exports = {
	fhirServerConfig,
	mongoConfig
};
