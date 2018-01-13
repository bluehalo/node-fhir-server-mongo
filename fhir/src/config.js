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
		port: env.PORT || env.SERVER_PORT,
		corsOptions: {
			maxAge: 86400
		}
	},
	logging: {
		level: env.LOGGING_LEVEL
	},
	security: [
		{
			url: 'authorize',
			valueUri: 'https://still-ocean-59878.herokuapp.com/authorize'
		},
		{
			url: 'token',
			valueUri: 'https://still-ocean-59878.herokuapp.com/token'
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
