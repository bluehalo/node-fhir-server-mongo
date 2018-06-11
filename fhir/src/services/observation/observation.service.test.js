/* eslint-disable */
const ObservationFixture = require('../../../fixtures/data/patient01/smokingstatus01.json');
const { CLIENT, CLIENT_DB } = require('../../constants');
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
			expect(results).toEqual(60);
		});

	});

	describe('Method: getObservation', () => {

		test('should correctly return all laboratory documents for this patient', async () => {
			let args = { patient: 1, category: 'laboratory' };
			let [ err, docs ] = await asyncHandler(
				observationService.getObservation(args, logger)
			);

			expect(err).toBeUndefined();
			expect(docs.length).toEqual(4);

			docs.forEach(doc => {
			 expect(doc.subject.reference).toEqual(`Patient/${args.patient}`);
			 expect(doc.category.coding[0].code).toEqual(args.category);
			});

		});

        test('should correctly return a specific laboratory document for this patient using all search parameters', async () => {
            let args = { patient: 1, category: 'laboratory', code: '2951-2', date: '2005-07-04T00:00:00+00:00' };
            let [ err, docs ] = await asyncHandler(
                observationService.getObservation(args, logger)
            );

            expect(err).toBeUndefined();
            expect(docs.length).toEqual(1);

            docs.forEach(doc => {
                expect(doc.subject.reference).toEqual(`Patient/${args.patient}`);
                expect(doc.category.coding[0].code).toEqual(args.category);
                expect(doc.code.coding[0].code).toEqual(args.code);
                expect(doc.effectiveDateTime).toEqual(args.date);
            })

        });

	});

	describe('Method: getObservationById', () => {

		test('should correctly return a document', async () => {
			let args = { id: '8' };
			let [ err, doc ] = await asyncHandler(
				observationService.getObservationById(args, logger)
			);

			expect(err).toBeUndefined();
			expect(doc.id).toEqual(args.id);
		});

	});

	describe('Method: deleteObservation', () => {

		// For these tests, let's do it in 3 steps
		// 1. Check the observation exists
		// 2. Delete an observation and make sure it does not throw
		// 3. Check the observation does not exist

		test('should successfully delete a document', async () => {

			// Look for this particular fixture
			let args = { id: '1' };
			let [ err, doc ] = await asyncHandler(
				observationService.getObservationById(args, logger)
			);

			expect(err).toBeUndefined();
			expect(doc.id).toEqual(args.id);

			// Now delete this fixture
			let [ delete_err, _ ] = await asyncHandler(
				observationService.deleteObservation(args, logger)
			);

			// There is no response resolved from this promise, so just check for an error
			expect(delete_err).toBeUndefined();

			// Now query for the fixture again, there should be no documents
			let [ query_err, missing_doc ] = await asyncHandler(
				observationService.getObservationById(args, logger)
			);

			expect(query_err).toBeUndefined();
			expect(missing_doc).toBeNull();

		});

	});

	describe('Method: createObservation', () => {

		// This Fixture was previously deleted, we are going to ensure before creating it
		// 1. Delete fixture
		// 2. Create fixture
		// 3. Query for fixture

		test('should successfully create a document', async () => {

			// Look for this particular fixture
			let args = {
				resource: {
					toJSON: () => ObservationFixture
				},
				id: '1'
			};

			// Delete the fixture incase it exists,
			// mongo won't throw if we delete something not there
			let [ delete_err, _ ] = await asyncHandler(
				observationService.deleteObservation(args, logger)
			);

			expect(delete_err).toBeUndefined();

			// Create the fixture, it expects two very specific args
			// The resource arg must be a class/object with a toJSON method
			let [ create_err, create_results ] = await asyncHandler(
				observationService.createObservation(args, logger)
			);

			expect(create_err).toBeUndefined();
			// Response should contain an id so core can set appropriate location headers
			expect(create_results.id).toEqual(args.id);


			// Verify the new fixture exists
			let [ query_err, doc ] = await asyncHandler(
				observationService.getObservationById(args, logger)
			);

			expect(query_err).toBeUndefined();
			expect(doc.id).toEqual(args.id);

		});

	});

	describe('Method: updateObservation', () => {

		// Let's check for the fixture's status and then try to change it
		// 1. Query fixture for status
		// 2. Update status
		// 3. Query fixture for updated status

		test('should successfully update a document', async () => {
			// Update the status
			ObservationFixture.status = 'preliminary';

			let args = {
				resource: {
					toJSON: () => ObservationFixture
				},
				id: '1'
			};

			// Query for the original doc, this will ignore the resource arg
			let [ query_err, doc ] = await asyncHandler(
				observationService.getObservationById(args, logger)
			);

			expect(query_err).toBeUndefined();
			expect(doc.status).toEqual('final');

			// Update the original doc
			let [ update_err, update_results ] = await asyncHandler(
				observationService.updateObservation(args, logger)
			);

			expect(update_err).toBeUndefined();
			expect(update_results.id).toEqual(args.id);

			// Query the newly updated doc and make sure the status is correct
			let [ updated_err, updated_doc ] = await asyncHandler(
				observationService.getObservationById(args, logger)
			);

			expect(updated_err).toBeUndefined();
			expect(updated_doc.status).toEqual('preliminary');

		});

	});

});
