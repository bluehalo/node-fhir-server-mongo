const jwt = require('jsonwebtoken');
const oauthValidator = require('./oauth.validator');
const UID = require('../../utils/uid.utils');

// This is a stub for an OAUTH server.  This is not to be used for production.
// This service is used mainly for testing and development.  This can be used
// to test your server on the FHIR Conformance Test Tool.




const normalizedUrl = url => url.replace(/\/$/, '');

/**
 * @name generateCode
 * @description Authorize the request and return a signed code to be exchanged for a token
 * @param {Winston} logger - Winston logger
 * @param {Object} config - FHIR Core server config object
 * @param {Object} options - Necessary options for generating the code
 * @return {Promise}
 */

module.exports.authorization = (req, logger, config, options) => new Promise((resolve, reject) => {

	logger.info('OAuth >>> generateCode');
	let { iss, launch, clientId, scope } = options;
	let { resourceServer } = config.auth;

	let incomingJwt = launch && launch.replace(/=/g, '');

	// @TODO: Follow OAuth specification here
	if (normalizedUrl(iss) !== normalizedUrl(resourceServer)) {
		logger.error('Bad Audience in OAuth.generateCode');
		reject(new Error('Bad Audience'));
	}

	return oauthValidator.getClient(clientId).then((client) => {
		if (!client) {
			reject(new Error('Invalid Client'));
		}

		// Prepare our code object for signing
		let code = {
			context: incomingJwt && jwt.decode(incomingJwt) || {},
			jti: UID.getUid(36),
			aud: client.clientId,
			iss: iss,
			scope: scope
		};

		resolve(jwt.sign(code, client.clientSecret, { expiresIn: '5m' }));

	})
	.catch(reject);


});

/**
 * @name generateToken
 * @description Authorize the request and return a signed code to be exchanged for a token
 * @param {Winston} logger - Winston logger
 * @param {Object} config - FHIR Core server config object
 * @param {Object} code - Returns a JsonWebToken from a signed code
 * @return {Promise}
 */
module.exports.token = (req, logger, config, code, secret) => new Promise((resolve, reject) => {
	logger.info('OAuth >>> generateToken');
	console.log(req.body);

	// decode token
	const decodedToken = jwt.decode(code, { complete: true });

	return oauthValidator.getClient(decodedToken.payload.aud).then((client) => {
		if (!client) {
			reject(new Error('Invalid Client'));
		}

		// public key
		// secret is not provided
		// TODO: Follow OAuth specification here for validating public clients
		if (!secret && client.isTrusted) {
			secret = client.clientSecret;
		}

		// Verify the token
		jwt.verify(code, secret, (err, decoded) => {
			if (err) {
				logger.error('Error verifying token in OAuth.generateToken: ', err);
				reject(err);
			}

			// If offline, attach a refresh token
			if (decoded.scope.indexOf('offline_access') >= -1) {
				decoded.context.refresh_token = jwt.sign(decoded, secret);
			}

			// Create our token object
			let token = Object.assign({}, decoded.context, {
				token_type: 'bearer',
				expires_in: 3600,
				scope: decoded.scope,
				aud: decoded.aud,
				iss: decoded.iss,
				jti: decoded.jti
			});

			// Create an access token that expires in one hour
			token.access_token = jwt.sign(token, secret, { expiresIn: '1h' });

			console.log('returning token');
			console.log(token);
			resolve(token);

		});

	})
	.catch(reject);
});
