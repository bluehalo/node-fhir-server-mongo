const { MongoClient } = require('mongodb');
const env = require('var');

/**
 * @name connect
 * @summary Connect to Mongo
 * @return {Promise}
 */
let connect = () => new Promise((resolve, reject) => {
	// Establish our connection url
	const CONNECTION_STRING = `mongodb://${env.MONGO_HOSTNAME}`;

	// Connect to mongo
	MongoClient.connect(CONNECTION_STRING, (err, client) => {
		if (err) {
			return reject(err);
		}

		resolve(client);
	});

});


module.exports = connect;
