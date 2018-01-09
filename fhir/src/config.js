const path = require('path');
const env = require('var');

/**
 * @name mongoConfig
 * @summary Configurations for our Mongo instance
 */
module.exports.mongoConfig = {
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
module.exports.fhirServerConfig = {
	auth: {
		clientId: 'nobody_special',
		secret: 'super_secret',
		discoveryUrl: 'https://sb-auth.smarthealthit.org/.well-known/openid-configuration',
		protectedResourceClientId: 'random_unimportant_id',
		protectedResourceClientSecret: 'random_unimportant_secret'
	},
	server: {
		port: env.SERVER_PORT,
		corsOptions: {
			maxAge: 86400
		},
		ssl: {
			key: path.resolve(env.SSL_KEY),
			cert: path.resolve(env.SSL_CERT)
		}
	},
	logging: {
		level: env.LOGGING_LEVEL
	},
	profiles: {
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
};
