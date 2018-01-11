const jsonwebtoken = require('jsonwebtoken');
const oauthValidator = require('./oauth.validator');
const clients = require('./clients');

const UID = require('../../utils/uid.utils');
let normalizedUrl = url => url.replace(/\/$/, '');

/**
 * @name generateCode
 * @description Authorize the request and return a signed code to be exchanged for a token
 * @param {Winston} logger - Winston logger
 * @param {Object} config - FHIR Core server config object
 * @param {Object} options - Necessary options for generating the code
 * @return {Promise}
 */

module.exports.generateCode = (logger, config, options) => new Promise((resolve, reject) => {

	// exameple
	// ?client_id=1b2c4540-0d8a-42ab-858b-9f1409583e96&response_type=code&scope=patient/*.read openid profile launch&redirect_uri=http://127.0.0.1:9090/&aud=https%3A%2F%2Fsb-fhir-dstu2.smarthealthit.org%2Fsmartdstu2%2Fdata&launch=x5ferf&state=99899296

	logger.info('OAuth >>> generateCode');
	let { iss, launch, clientId, scope } = options;
	let { resourceServer } = config;

	let incomingJwt = launch && launch.replace(/=/g, '');

	// @TODO: Follow OAuth specification here
	if (normalizedUrl(iss) !== normalizedUrl(resourceServer)) {
		logger.error('Bad Audience in OAuth.generateCode');
		reject(new Error('Bad Audience'));
	}

	let client = await service.getClient(clientId);

	if (!client){
		return reject(new Error('Invalid Client'));
	}

	// Prepare our code object for signing
	let code = {
		context: incomingJwt && jwt.decode(incomingJwt) || {},
		jti: UID.getUid(36),
		aud: clientId,
		iss: iss,
		scope,
	};

	return resolve(jsonwebtoken.sign(code, client.secret, { expiresIn: '5m' }));
});

/**
 * @name generateToken
 * @description Authorize the request and return a signed code to be exchanged for a token
 * @param {Winston} logger - Winston logger
 * @param {Object} config - FHIR Core server config object
 * @param {Object} code - Returns a JsonWebToken from a signed code
 * @return {Promise}
 */
module.exports.generateToken = (logger, config, code, secret) => new Promise((resolve, reject) => {
	logger.info('OAuth >>> generateToken');



	// decode token
	const decodedToken = jwt.decode(bearerToken, { complete: true });

	// verify client
	let client = await service.getClient(decodedToken.aud);

	if (!client) {
		return reject(new Error('Invalid Client'));
	}

	// public key
	// secret is not provided
	// TODO: Follow OAuth specification here
	if (!secret && !client.isTrusted) {
		secret = client.secret;
	}

	// Verify the token
	jsonwebtoken.verify(code, secret, (err, decoded) => {
		if (err) {
			logger.error('Error verifying token in OAuth.generateToken: ', err);
			reject(err);
		}

		// If offline, attach a refresh token
		if (decoded.scope.indexOf('offline_access') >= -1) {
			decoded.conetxt.refresh_token = jsonwebtoken.sign(decoded, secret);
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
		token.access_token = jsonwebtoken.sign(token, secret, { expiresIn: '1h' });

		resolve(token);
	});
});
