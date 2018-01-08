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
		clientId: 'client_id',
		secret: 'secret',
		discoveryUrl: 'https://sb-auth.smarthealthit.org/.well-known/openid-configuration',
		protectedResourceClientId: 'ae83b0eb-35ed-483b-a933-edb2277f4aad',
		protectedResourceClientSecret: 'AK1MPC0PT44icz7awMie4Pasd9BOMcJ6rTAazq2Ni01nQLecxqqtrcXKrz4bciQOaL5tjclmSKO064u9n1IoDzE'
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
