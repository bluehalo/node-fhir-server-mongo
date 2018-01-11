const jwt = require('jsonwebtoken');
const clients = require('./clients');

/**
 * @name getClient
 * @description How to get
 * @param {Winston} logger - Winston logger
 * @param {Object} config - FHIR Core server config object
 * @param {Object} options - Necessary options for generating the code
 * @return {Promise}
 */
module.exports.getClient = (logger, config, clientId) => new Promise((resolve, reject) => {
	logger.info('Getting client');
	return clients.findById(clientId, (err, cl) => {
		if (err) {
			reject(err);
		}
		resolve(cl);
	});
});


/**
 * @name validateSignature
 * @description Provide a method to validate the signature.
 * @param {Winston} logger - Winston logger
 * @param {Object} config - FHIR Core server config object
 * @param {Object} options - Necessary options for generating the code
 * @return {Promise}
 */
module.exports.validateSignature = (logger, config, token) => new Promise((resolve, reject) => {

	const decodedToken = jwt.decode(bearerToken, { complete: true });

	// Verify the signature
	clients.findById(decodedToken.aud, (err, client) => {
		if (err) {
			reject(err);
		}

		if (client.secret) {
			try {
				decoded = jwt.verify(token, client.secret, allOptions);
			} catch (err) {
				logger.error(err, err.message);
				reject(err);
			}
		}

		resolve(client);
	});

});
