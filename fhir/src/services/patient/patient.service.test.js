/* eslint-disable */
const PatientFixture = require('../../../fixtures/data/patient00/patient00.json');
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

	describe('Method: count', () => {

		test('should correctly pass back the count', async () => {
			let [ err, results ] = await asyncHandler(
				patientService.count(null, logger)
			);

			expect(err).toBeUndefined();
			expect(results).toEqual(13);
		});

	});

	describe('Method: search', () => {

		test('should correctly return all male patients', async () => {
			let args = { gender: 'male' };
            let contexts = {};
			let [ err, docs ] = await asyncHandler(
				patientService.search(args, contexts, logger)
			);

			expect(err).toBeUndefined();
			expect(docs.length).toEqual(7);

			docs.forEach(doc => expect(doc.gender).toEqual('male'));

		});

        test('should correctly return a specific human patient using all search parameters', async () => {
            let args = { _id: '0', active: 'true', address: '534 Erewhon St PleasantVille, Rainbow, Vic  3999', addressCity: 'PleasantVille',
                addressCountry: 'US', addressPostalCode: '3999', addressState: 'Vic', addressUse: 'home', birthDate: '1974-12-25',
				deathDate: '2015-02-14T13:42:00+10:00', deceased: 'true', email: 'email|p.heuvel@gmail.com', family: 'Chalmers',
				gender: 'male', generalPractitioner: 'example', given: 'Peter', identifier: 'urn:oid:1.2.36.146.595.217.0.1|12345',
                language: 'urn:ietf:bcp:47|nl-NL', link: 'pat2', name: 'Peter James Chalmers', organization: '1',
				phone: '(03) 5555 6473', telecom: '(03) 3410 5613'};
            let contexts = {};
            let [ err, docs ] = await asyncHandler(
                patientService.search(args, contexts, logger)
            );

            // console.log(JSON.stringify(docs));

            expect(err).toBeUndefined();
            expect(docs.length).toEqual(1);


            docs.forEach(doc => {
                expect(doc.id).toEqual(args._id);
                expect(doc.active).toBeTruthy();
                expect(doc.address[0].line[0]).toEqual('534 Erewhon St');
                expect(doc.address[0].district).toEqual('Rainbow');
                expect(doc.address[0].city).toEqual('PleasantVille');
                expect(doc.address[0].country).toEqual('US');
                expect(doc.address[0].postalCode).toEqual('3999');
                expect(doc.address[0].state).toEqual('Vic');
                expect(doc.address[0].use).toEqual(args.addressUse);
                expect(doc.birthDate).toEqual(args.birthDate);
                expect(doc.deceasedDateTime).toEqual(args.deathDate);
                expect(doc.deceasedBoolean).toBeTruthy();
                expect(doc.telecom[4].system).toEqual('email');
                expect(doc.telecom[4].value).toEqual('p.heuvel@gmail.com');
                expect(doc.name[0].family).toEqual(args.family);
                expect(doc.gender).toEqual(args.gender);
                expect(doc.generalPractitioner[0].reference).toEqual('Practitioner/example');
                expect(doc.name[0].given[0]).toEqual('Peter');
                expect(doc.identifier[0].system).toEqual('urn:oid:1.2.36.146.595.217.0.1');
                expect(doc.identifier[0].value).toEqual('12345');
                expect(doc.communication[0].language.coding[0].system).toEqual('urn:ietf:bcp:47');
                expect(doc.communication[0].language.coding[0].code).toEqual('nl-NL');
                expect(doc.link[0].other.reference).toEqual('Patient/pat2');
                expect(doc.managingOrganization.reference).toEqual('Organization/1');
                expect(doc.telecom[1].system).toEqual('phone');
                expect(doc.telecom[1].value).toEqual('(03) 5555 6473');
                expect(doc.telecom[2].system).toEqual('phone');
                expect(doc.telecom[2].value).toEqual('(03) 3410 5613');
            });

        });

        test('should correctly return a specific animal patient', async () => {
            let args = {
                animalBreed: 'http://snomed.info/sct|58108001', animalSpecies: 'http://hl7.org/fhir/animal-species|canislf'
            };
            let contexts = {};
            let [err, docs] = await asyncHandler(
                patientService.search(args, contexts, logger)
            );

            // console.log(JSON.stringify(docs));

            expect(err).toBeUndefined();
            expect(docs.length).toEqual(1);

            docs.forEach(doc => {
                expect(doc.animal.breed.coding[0].system).toEqual('http://snomed.info/sct');
                expect(doc.animal.breed.coding[0].code).toEqual('58108001');
                expect(doc.animal.species.coding[0].system).toEqual('http://hl7.org/fhir/animal-species');
                expect(doc.animal.species.coding[0].code).toEqual('canislf');
            });

        });

	});

	describe('Method: searchById', () => {

		test('should correctly return a document', async () => {
			let args = { id: '0' };
            let contexts = {};
			let [ err, doc ] = await asyncHandler(
				patientService.searchById(args, contexts, logger)
			);

			expect(err).toBeUndefined();
			expect(doc.id).toEqual(args.id);
		});

	});

	describe('Method: remove', () => {

		// For these tests, let's do it in 3 steps
		// 1. Check the patient exists
		// 2. Delete an patient and make sure it does not throw
		// 3. Check the patient does not exist

		test('should successfully delete a document', async () => {

			// Look for this particular fixture
			let args = { id: '0' };
            let contexts = {};
			let [ err, doc ] = await asyncHandler(
				patientService.searchById(args, contexts, logger)
			);

			expect(err).toBeUndefined();
			expect(doc.id).toEqual(args.id);

			// Now delete this fixture
			let [ delete_err, _ ] = await asyncHandler(
				patientService.remove(args, logger)
			);

			// There is no response resolved from this promise, so just check for an error
			expect(delete_err).toBeUndefined();

			// Now query for the fixture again, there should be no documents
			let [ query_err, missing_doc ] = await asyncHandler(
				patientService.searchById(args, contexts, logger)
			);

			expect(query_err).toBeUndefined();
			expect(missing_doc).toBeNull();

		});

	});

	describe('Method: create', () => {

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
				id: '0'
			};
            let contexts = {};

			// Delete the fixture incase it exists,
			// mongo won't throw if we delete something not there
			let [ delete_err, _ ] = await asyncHandler(
				patientService.remove(args, logger)
			);

			expect(delete_err).toBeUndefined();

			// Create the fixture, it expects two very specific args
			// The resource arg must be a class/object with a toJSON method
			let [ create_err, create_results ] = await asyncHandler(
				patientService.create(args, logger)
			);

			expect(create_err).toBeUndefined();
			// Response should contain an id so core can set appropriate location headers
			expect(create_results.id).toEqual(args.id);


			// Verify the new fixture exists
			let [ query_err, doc ] = await asyncHandler(
				patientService.searchById(args, contexts, logger)
			);

			expect(query_err).toBeUndefined();
			expect(doc.id).toEqual(args.id);

		});

	});

	describe('Method: update', () => {

		// Let's check for the fixture's active property and then try to change it
		// 1. Query fixture for active
		// 2. Update active property
		// 3. Query fixture for updated property

		test('should successfully update a document', async () => {
			// Update the status
			PatientFixture.text.status = 'preliminary';

			let args = {
				resource: {
					toJSON: () => PatientFixture
				},
				id: '0'
			};
            let contexts = {};

			// Query for the original doc, this will ignore the resource arg
			let [ query_err, doc ] = await asyncHandler(
				patientService.searchById(args, contexts, logger)
			);

			expect(query_err).toBeUndefined();
			expect(doc.text.status).toEqual('generated');

			// Update the original doc
			let [ update_err, update_results ] = await asyncHandler(
				patientService.update(args, logger)
			);

			expect(update_err).toBeUndefined();
			expect(update_results.id).toEqual(args.id);

			// Query the newly updated doc and make sure the status is correct
			let [ updated_err, updated_doc ] = await asyncHandler(
				patientService.searchById(args, contexts, logger)
			);

			expect(updated_err).toBeUndefined();
			expect(updated_doc.text.status).toEqual('preliminary');

		});

	});

});
