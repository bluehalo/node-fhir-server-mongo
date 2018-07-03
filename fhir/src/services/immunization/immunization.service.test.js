/* eslint-disable */
const ImmunizationFixture = require('../../../fixtures/data/patient00/immunization00.json');
const { CLIENT, CLIENT_DB } = require('../../constants');
const asyncHandler = require('../../lib/async-handler');
const logger = require('../../testutils/logger.mock');
const immunizationService = require('./immunization.service');
const { mongoConfig } = require('../../config');
const mongoClient = require('../../lib/mongo');
let globals = require('../../globals');

describe('Immunization Service Test', () => {

    beforeAll(async () => {

        let [err, client] = await asyncHandler(
            mongoClient(mongoConfig.connection, mongoConfig.options)
        );

        // We should fail these tests if we can't connect,
        // they won't work without the connection
        if (err) {
            throw err;
        }

        globals.set(CLIENT, client);
        globals.set(CLIENT_DB, client.db(mongoConfig.db_name));

    });

    afterAll(() => {
        let client = globals.get(CLIENT);
        client.close();
    });

    describe('Method: search', () => {

        test('should return 2 immunizations', async () => {
            let args = { patient: 'example', date: '2016-01-08',
            vaccineCode: 'http://hl7.org/fhir/sid/cvx|158' };
            let [ err, docs ] = await asyncHandler(
                immunizationService.search(args, logger)
            );

            expect(err).toBeUndefined();
            expect(docs.length).toEqual(2);

            docs.forEach(doc => {
                expect(doc.patient.reference).toEqual(`Patient/${args.patient}`);
                expect(doc.date).toEqual('2016-01-08');
                expect(doc.vaccineCode.coding[0].system).toEqual('http://hl7.org/fhir/sid/cvx');
                expect(doc.vaccineCode.coding[0].code).toEqual('158');
            });

        });
        test('testing some added search params', async () => {
            let args = { patient: 'example', doseSequence: 'ge-4', location: '1',
            identifier: 'urn:ietf:rfc:3986|urn:oid:1.3.6.1.4.1.21367.2005.3.7.1234',
          lotNumber: 'AAJN11K', manufacturer: 'Organization/hl7', notGiven: 'false',
        practitioner: 'example', reaction: 'Observation/example', reactionDate: '2013-01-10',
      reason: 'http://snomed.info/sct|429060002', status: 'completed' };
            let [ err, docs ] = await asyncHandler(
                immunizationService.search(args, logger)
            );

            expect(err).toBeUndefined();
            expect(docs.length).toEqual(1);

            docs.forEach(doc => {
                expect(doc.patient.reference).toEqual(`Patient/${args.patient}`);
                expect(doc.vaccinationProtocol[0].doseSequence).toEqual(1);
                expect(doc.identifier[0].system).toEqual('urn:ietf:rfc:3986');
                expect(doc.identifier[0].value).toEqual('urn:oid:1.3.6.1.4.1.21367.2005.3.7.1234');
                expect(doc.location.reference).toEqual('Location/1');
                expect(doc.lotNumber).toEqual('AAJN11K');
                expect(doc.manufacturer.reference).toEqual('Organization/hl7');
                expect(doc.notGiven).toEqual(false);
                expect(doc.practitioner[0].actor.reference).toEqual('Practitioner/example');
                expect(doc.reaction[0].detail.reference).toEqual('Observation/example')
                expect(doc.reaction[0].date).toEqual('2013-01-10')
                expect(doc.explanation.reason[0].coding[0].system).toEqual('http://snomed.info/sct');
                expect(doc.explanation.reason[0].coding[0].code).toEqual('429060002');
                expect(doc.status).toEqual('completed');
            });
        });
    });

    describe('Method: count', () => {

        test('should correctly pass back the count', async () => {
            let [err, results] = await asyncHandler(
                immunizationService.count(null, logger)
            );

            expect(err).toBeUndefined();
            expect(results).toEqual(12);
        });

    });

    describe('Method: searchById', () => {

        test('should correctly return a document', async () => {
            let args = { id: '0' };
            let [ err, doc ] = await asyncHandler(
                immunizationService.searchById(args, logger)
            );

            expect(err).toBeUndefined();
            expect(doc.id).toEqual(args.id);
        });

    });

    describe('Method: remove', () => {

        // For these tests, let's do it in 3 steps
        // 1. Check the immunization exists
        // 2. Delete an immunization and make sure it does not throw
        // 3. Check the immunization does not exist

        test('should successfully delete a document', async () => {

            // Look for this particular fixture
            let args = { id: '0' };
            let [ err, doc ] = await asyncHandler(
                immunizationService.searchById(args, logger)
            );

            expect(err).toBeUndefined();
            expect(doc.id).toEqual(args.id);

            // Now delete this fixture
            let [ delete_err, _ ] = await asyncHandler(
                immunizationService.remove(args, logger)
            );

            // There is no response resolved from this promise, so just check for an error
            expect(delete_err).toBeUndefined();

            // Now query for the fixture again, there should be no documents
            let [ query_err, missing_doc ] = await asyncHandler(
                immunizationService.searchById(args, logger)
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
                    toJSON: () => ImmunizationFixture
                },
                id: '0'
            };

            // Delete the fixture incase it exists,
            // mongo won't throw if we delete something not there
            let [ delete_err, _ ] = await asyncHandler(
                immunizationService.remove(args, logger)
            );

            expect(delete_err).toBeUndefined();

            // Create the fixture, it expects two very specific args
            // The resource arg must be a class/object with a toJSON method
            let [ create_err, create_results ] = await asyncHandler(
                immunizationService.create(args, logger)
            );

            expect(create_err).toBeUndefined();
            // Response should contain an id so core can set appropriate location headers
            expect(create_results.id).toEqual(args.id);


            // Verify the new fixture exists
            let [ query_err, doc ] = await asyncHandler(
                immunizationService.searchById(args, logger)
            );

            expect(query_err).toBeUndefined();
            expect(doc.id).toEqual(args.id);

        });

    });

    describe('Method: update', () => {

        // Let's check for the fixture's status and then try to change it
        // 1. Query fixture for status
        // 2. Update status
        // 3. Query fixture for updated status

        test('should successfully update a document', async () => {
            // Update the status
            ImmunizationFixture.status = 'preliminary';

            let args = {
                resource: {
                    toJSON: () => ImmunizationFixture
                },
                id: '0'
            };

            // Query for the original doc, this will ignore the resource arg
            let [query_err, doc] = await asyncHandler(
                immunizationService.searchById(args, logger)
            );

            expect(query_err).toBeUndefined();
            expect(doc.status).toEqual('completed');

            // Update the original doc
            let [update_err, update_results] = await asyncHandler(
                immunizationService.update(args, logger)
            );

            expect(update_err).toBeUndefined();
            expect(update_results.id).toEqual(args.id);

            // Query the newly updated doc and make sure the status is correct
            let [updated_err, updated_doc] = await asyncHandler(
                immunizationService.searchById(args, logger)
            );

            expect(updated_err).toBeUndefined();
            expect(updated_doc.status).toEqual('preliminary');

        });

    });

});
