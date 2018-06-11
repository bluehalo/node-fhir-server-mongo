/* eslint-disable */
const PatientFixture = require('../../../fixtures/data/patient01/patient.json');
const { CLIENT, CLIENT_DB } = require('../../constants');
const asyncHandler = require('../../lib/async-handler');
const logger = require('../../testutils/logger.mock');
const patientService = require('./patient.service');
const { mongoConfig } = require('../../config');
const mongoClient = require('../../lib/mongo');
let globals = require('../../globals');

describe('Patient Service Test', () => {

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
				patientService.getCount(null, logger)
			);

			expect(err).toBeUndefined();
			expect(results).toEqual(11);
		});

	});

	describe('Method: getPatient', () => {

		test('should correctly return all male patients', async () => {
			let args = { gender: 'male' };
			let [ err, docs ] = await asyncHandler(
				patientService.getPatient(args, logger)
			);

			expect(err).toBeUndefined();
			expect(docs.length).toEqual(6);

			docs.forEach(doc => expect(doc.gender).toEqual('male'));

		});

        test('should correctly return a specific patient using all search parameters', async () => {
            let args = { id: '1', identifier: 'https://sitenv.org|211-778-2345', name: 'John', family: 'John', given: 'Doe', gender: 'male', birthDate: '1980-01-01' };
            let [ err, docs ] = await asyncHandler(
                patientService.getPatient(args, logger)
            );

            expect(err).toBeUndefined();
            expect(docs.length).toEqual(1);

            docs.forEach(doc => expect(doc.id).toEqual('1'));
            docs.forEach(doc => expect(doc.identifier[0].system).toEqual('https://sitenv.org'));
            docs.forEach(doc => expect(doc.identifier[0].value).toEqual('211-778-2345'));
            docs.forEach(doc => expect(doc.name[0].family[0]).toEqual('John'));
            docs.forEach(doc => expect(doc.name[0].given[0]).toEqual('Doe'));
            docs.forEach(doc => expect(doc.gender).toEqual('male'));
            docs.forEach(doc => expect(doc.birthDate).toEqual('1980-01-01'));

        });

	});

	describe('Method: getPatientById', () => {

		test('should correctly return a document', async () => {
			let args = { id: '1' };
			let [ err, doc ] = await asyncHandler(
				patientService.getPatientById(args, logger)
			);

			expect(err).toBeUndefined();
			expect(doc.id).toEqual(args.id);
		});

	});

	describe('Method: deletePatient', () => {

		// For these tests, let's do it in 3 steps
		// 1. Check the patient exists
		// 2. Delete an patient and make sure it does not throw
		// 3. Check the patient does not exist

		test('should successfully delete a document', async () => {

			// Look for this particular fixture
			let args = { id: '1' };
			let [ err, doc ] = await asyncHandler(
				patientService.getPatientById(args, logger)
			);

			expect(err).toBeUndefined();
			expect(doc.id).toEqual(args.id);

			// Now delete this fixture
			let [ delete_err, _ ] = await asyncHandler(
				patientService.deletePatient(args, logger)
			);

			// There is no response resolved from this promise, so just check for an error
			expect(delete_err).toBeUndefined();

			// Now query for the fixture again, there should be no documents
			let [ query_err, missing_doc ] = await asyncHandler(
				patientService.getPatientById(args, logger)
			);

			expect(query_err).toBeUndefined();
			expect(missing_doc).toBeNull();

		});

	});

	describe('Method: createPatient', () => {

		// This Fixture was previously deleted, we are going to ensure before creating it
		// 1. Delete fixture
		// 2. Create fixture
		// 3. Query for fixture

		test('should successfully create a document', async () => {

			// Look for this particular fixture
			let args = {
				resource: {
					toJSON: () => PatientFixture
				},
				id: '1'
			};

			// Delete the fixture incase it exists,
			// mongo won't throw if we delete something not there
			let [ delete_err, _ ] = await asyncHandler(
				patientService.deletePatient(args, logger)
			);

			expect(delete_err).toBeUndefined();

			// Create the fixture, it expects two very specific args
			// The resource arg must be a class/object with a toJSON method
			let [ create_err, create_results ] = await asyncHandler(
				patientService.createPatient(args, logger)
			);

			expect(create_err).toBeUndefined();
			// Response should contain an id so core can set appropriate location headers
			expect(create_results.id).toEqual(args.id);


			// Verify the new fixture exists
			let [ query_err, doc ] = await asyncHandler(
				patientService.getPatientById(args, logger)
			);

			expect(query_err).toBeUndefined();
			expect(doc.id).toEqual(args.id);

		});

	});

	describe('Method: updatePatient', () => {

		// Let's check for the fixture's active property and then try to change it
		// 1. Query fixture for active
		// 2. Update active property
		// 3. Query fixture for updated property

		test('should successfully update a document', async () => {
			// Update the status
			PatientFixture.active = false;

			let args = {
				resource: {
					toJSON: () => PatientFixture
				},
				id: '1'
			};

			// Query for the original doc, this will ignore the resource arg
			let [ query_err, doc ] = await asyncHandler(
				patientService.getPatientById(args, logger)
			);

			expect(query_err).toBeUndefined();
			expect(doc.active).toBeTruthy();

			// Update the original doc
			let [ update_err, update_results ] = await asyncHandler(
				patientService.updatePatient(args, logger)
			);

			expect(update_err).toBeUndefined();
			expect(update_results.id).toEqual(args.id);

			// Query the newly updated doc and make sure the status is correct
			let [ updated_err, updated_doc ] = await asyncHandler(
				patientService.getPatientById(args, logger)
			);

			expect(updated_err).toBeUndefined();
			expect(updated_doc.active).toBeFalsy();

		});

	});

});
