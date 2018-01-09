/* eslint-disable */
const { COLLECTION, CLIENT, CLIENT_DB } = require('../../constants');
const observationService = require('./observation.service');
const asyncHandler = require('../../lib/async-handler');
const logger = require('../../testutils/logger.mock');
const { mongoConfig } = require('../../config');
const mongoClient = require('../../lib/mongo');
let globals = require('../../globals');

describe('Observation Service Test', () => {

	beforeAll(async () => {

		let [ err, client ] = await asyncHandler(
			mongoClient(mongoConfig.connection, mongoConfig.options)
		);

		// We should fail these tests if we can't connect,
		// they won't work without the connection
		if (err) { throw err; }

		globals.set(CLIENT, client);
		globals.set(CLIENT_DB, client.db(mongoConfig.db_name));

	});

	afterAll(() => {
		let client = globals.get(CLIENT);
		client.close();
	});

	describe('Method: getCount', () => {

		test('should correctly pass back the count', async () => {
			let [ err, results ] = await asyncHandler(
				observationService.getCount(null, logger)
			);

			expect(err).toBeUndefined();
			expect(results).toEqual(16);
		});

	});

	describe('Method: getObservation', () => {

		test('should correctly return a document', async () => {
			// Set the results for our global client
			// let query = { patient: 2, category: 'foo', code: 'bar', date: new Date().toISOString() };
			let [ err, docs ] = await asyncHandler(
				observationService.getObservation({ query: {} }, logger)
			);

			expect(err).toBeUndefined();
			// expect(docs.id).toEqual(observation.id);
		});

	});

	describe('Method: getObservationByID', () => {

		test('should correctly return a document', async () => {
			// Set the results for our global client
			let params = { id: '8' };
			let [ err, docs ] = await asyncHandler(
				observationService.getObservationByID({ params }, logger)
			);

			expect(err).toBeUndefined();
			expect(docs.id).toEqual(params.id);
		});

	});

});
