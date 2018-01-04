const jsonwebtoken = require('jsonwebtoken');

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
	logger.info('OAuth >>> generateCode');
	let { aud, launch, clientId, scope } = options;
	let { secret, resourceServer } = config;
	let incomingToken = launch && launch.replace(/=/g, '');

	// @TODO: Follow OAuth specification here
	if (normalizedUrl(aud) !== normalizedUrl(resourceServer)) {
		logger.error('Bad Audience in OAuth.generateCode');
		reject(new Error('Bad Audience'));
	}

	// Prepare our code object for signing
	let code = {
		context: incomingToken ? jsonwebtoken.decode(incomingToken) : {},
		jti: '45fc543a-8ff4-4fbf-b1f8-9976aac7f7e0', // Generate this, maybe crypto.randomBytes(36).toString('hex')
		aud: clientId,
		iss: aud,
		scope,
	};

	return resolve(jsonwebtoken.sign(code, secret, { expiresIn: '5m' }));
});

/**
 * @name generateToken
 * @description Authorize the request and return a signed code to be exchanged for a token
 * @param {Winston} logger - Winston logger
 * @param {Object} config - FHIR Core server config object
 * @param {Object} code - Returns a JsonWebToken from a signed code
 * @return {Promise}
 */
module.exports.generateToken = (logger, config, code) => new Promise((resolve, reject) => {
	logger.info('OAuth >>> generateToken');
	let { secret } = config;

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
