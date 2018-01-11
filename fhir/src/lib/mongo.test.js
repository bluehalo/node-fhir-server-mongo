const asyncHandler = require('./async-handler');
const { mongoConfig } = require('../config');
const mongo = require('./mongo');

describe('Mongo Test', () => {

	test('should return a valid connection when given proper config', async () => {
		// Connect to mongo and pass any options here
		let [ err, client ] = await asyncHandler(
			mongo(mongoConfig.connection, mongoConfig.options)
		);

		let terminate = () => client.close();

		expect(err).toBeUndefined();
		expect(client).toBeDefined();
		expect(typeof client.db).toEqual('function');
		expect(terminate).not.toThrow();

	});

	test('should return an error for an invalid hostname', async () => {
		// Connect to mongo and pass any options here
		let [ err, client ] = await asyncHandler(
			mongo('mongodb://notmongo:3000', mongoConfig.options)
		);

		expect(err).toBeDefined();
		expect(err.name).toEqual('MongoNetworkError');
		expect(client).toBeUndefined();

	});

});
