const { COLLECTION, CLIENT_DB } = require('../../constants');
const globals = require('../../globals');

/**
 * @name findByClientId
 * @description Get an client by the client ID from our database
 * @param {Express.req} req - Express request object
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.findByClientId = (clientId, logger) => new Promise((resolve, reject) => {
	// Grab an instance of our DB and collection
	let db = globals.get(CLIENT_DB);
	let collection = db.collection(COLLECTION.CLIENT);

	// Query our collection for this client
	return collection.findOne({ clientId }, (err, client) => {
		if (err) {
			logger.error('Error with Client.findByClientId: ', err);
			return reject(err);
		}

		resolve(client);
	});
});
