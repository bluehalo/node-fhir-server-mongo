const mockMongoClient = require('../../testutils/collection.mock');
const observationService = require('./observation.service');
const mockLogger = require('../../testutils/logger.mock');
const asyncHandler = require('../../lib/async-handler');
const { CLIENT_DB } = require('../../constants');
let globals = require('../../globals');

let client;

describe('Observation Service Test', () => {

	beforeEach(() => {
		client = mockMongoClient();
		globals.set(CLIENT_DB, client);
	});

	describe('Method: getCount', () => {

		test('should correctly pass back an error', async () => {
			// Set our global client to error on it's next call
			let message = 'Unable to connect to DB';
			client.setError(message);
			// Invoke our service and test it correctly returns the error we gave it
			// It takes a req and a logger and returns a promise
			let [ err, results ] = await asyncHandler(
				observationService.getCount(null, mockLogger)
			);

			expect(results).toBeUndefined();
			expect(err.message).toEqual(message);

		});

		test('should correctly pass back the count', async () => {
			// Set the results for our global client
			let count = 24;
			client.setResults(count);
			// Invoke our service and test it correctly returns the error we gave it
			// It takes a req and a logger and returns a promise
			let [ err, results ] = await asyncHandler(
				observationService.getCount(null, mockLogger)
			);

			expect(err).toBeUndefined();
			expect(results).toEqual(24);
		});

	});

	describe('Method: getObservation', () => {

		test('should correctly pass back an error', async () => {
			// Set our global client to error on it's next call
			let message = 'Unable to connect to DB';
			client.setError(message);
			// Invoke our service and test it correctly returns the error we gave it
			// It takes a req and a logger and returns a promise
			let [ err, results ] = await asyncHandler(
				observationService.getObservation({ query: {}}, mockLogger)
			);

			expect(results).toBeUndefined();
			expect(err.message).toEqual(message);
		});

		test('should correctly return a document', async () => {
			// Set the results for our global client
			let observation = { id: 12 };
			let query = { patient: 2, category: 'foo', code: 'bar', date: new Date().toISOString() };
			client.setResults(observation);
			// Invoke our service and test it correctly returns the error we gave it
			// It takes a req and a logger and returns a promise
			let [ err, results ] = await asyncHandler(
				observationService.getObservation({ query }, mockLogger)
			);

			expect(err).toBeUndefined();
			expect(results.id).toEqual(observation.id);
		});

	});

	describe('Method: getObservationByID', () => {

		test('should correctly pass back an error', async () => {
			// Set our global client to error on it's next call
			let message = 'Unable to connect to DB';
			client.setError(message);
			// Invoke our service and test it correctly returns the error we gave it
			// It takes a req and a logger and returns a promise
			let [ err, results ] = await asyncHandler(
				observationService.getObservationByID({ params: {}}, mockLogger)
			);

			expect(results).toBeUndefined();
			expect(err.message).toEqual(message);
		});

		test('should correctly return a document', async () => {
			// Set the results for our global client
			let observation = { id: 12 };
			client.setResults(observation);
			// Invoke our service and test it correctly returns the error we gave it
			// It takes a req and a logger and returns a promise
			let [ err, results ] = await asyncHandler(
				observationService.getObservationByID({ params: observation }, mockLogger)
			);

			expect(err).toBeUndefined();
			expect(results.id).toEqual(observation.id);
		});

	});

});
