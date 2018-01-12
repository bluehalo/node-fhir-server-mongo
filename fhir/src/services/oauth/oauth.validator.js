const clients = require('./client.service');

/**
 * @name getClient
 * @description Gets the necessary client information so the auth service can
 * validate the token and signature.
 * In our case, we can look up the client information directly for this stub.
 *
 * @param {Winston} logger - Winston logger
 * @param {Object} config - FHIR Core server config object
 * @param {Object} options - Necessary options for generating the code
 * @return {Promise}
 */
module.exports.getClient = (clientId) => new Promise((resolve, reject) => {
	clients.findByClientId(clientId).then((client) => {
		resolve(client);
	})
	.catch(reject);
});

/**
 * @name validateSignature
 * @description Provide a method to validate the signature.   This is a boilerplate
 * a dev can use to help determine by other OAUTH convention to validate the token.
 *
 * @param {Winston} logger - Winston logger
 * @param {Object} config - FHIR Core server config object
 * @param {Object} options - Necessary options for generating the code
 * @return {Promise}
 */
module.exports.validateSignature = (token) => new Promise((resolve, reject) => {

	// TODO: follow OAUTH spec to validate token

	// Verify the signature
	reject(token);
});
