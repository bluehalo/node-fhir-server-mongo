/* eslint-disable */
const { COLLECTION, CLIENT, CLIENT_DB } = require('../../constants');
const observationService = require('./observation.service');
const mockLogger = require('../../testutils/logger.mock');
const asyncHandler = require('../../lib/async-handler');
const { mongoConfig } = require('../../config');
const mongoClient = require('../../lib/mongo');
let globals = require('../../globals');

describe('Observation Service Test', () => {

	beforeAll(async () => {

		let [ err, client ] = await asyncHandler(
			mongoClient(mongoConfig.connection, mongoConfig.options)
		);

		let db = client.db(`${mongoConfig.db_name}_test`);
		let collection = db.collection(COLLECTION.OBSERVATION);
		let count = await collection.count();

		// Clear out the collection if there are any documents in it
		if (count) {
			collection.drop();
		}

		await asyncHandler(collection.insert({ id: 1, type: 'observation' }));

		globals.set(CLIENT, client);
		globals.set(CLIENT_DB, db);

	});

	afterAll(() => {
		let client = globals.get(CLIENT);
		client.close();
	});

	describe('Method: getCount', () => {

		test('should correctly pass back the count', async () => {
			let [ err, results ] = await asyncHandler(
				observationService.getCount(null, mockLogger)
			);

			expect(err).toBeUndefined();
			expect(results).toEqual(1);
		});

	});

	describe('Method: getObservation', () => {

		test('should correctly return a document', async () => {
			// Set the results for our global client
			// let query = { patient: 2, category: 'foo', code: 'bar', date: new Date().toISOString() };
			let [ err, docs ] = await asyncHandler(
				observationService.getObservation({ query: {} }, mockLogger)
			);

			expect(err).toBeUndefined();
			// expect(docs.id).toEqual(observation.id);
		});

	});

	describe('Method: getObservationByID', () => {

		test('should correctly return a document', async () => {
			// Set the results for our global client
			let params = { id: 1 };
			let [ err, docs ] = await asyncHandler(
				observationService.getObservationByID({ params }, mockLogger)
			);

			expect(err).toBeUndefined();
			expect(docs.id).toEqual(params.id);
		});

	});

});
