/* eslint-disable */
const PatientFixture = require('../../../fixtures/patient01/patient.json');
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
			expect(results).toEqual(10);
		});

	});

	describe('Method: getPatient', () => {

	});

	describe('Method: getPatientById', () => {

	});

	describe('Method: deletePatient', () => {

	});

	describe('Method: createPatient', () => {

	});

	describe('Method: updatePatient', () => {

	});

});
