/* eslint-disable */
const MedicationRequestFixture = require('../../../fixtures/data/uscore/MedicationRequest-uscore-mo1.json');
const { CLIENT, CLIENT_DB } = require('../../constants');
const asyncHandler = require('../../lib/async-handler');
const logger = require('../../testutils/logger.mock');
const medicationrequestService = require('./medicationrequest.service');
const { mongoConfig } = require('../../config');
const mongoClient = require('../../lib/mongo');
let globals = require('../../globals');

describe('MedicationRequest Service Test', () => {

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

    describe('Method: count', () => {

        test('should correctly pass back the count', async () => {
            let [err, results] = await asyncHandler(
                medicationrequestService.count(null, logger)
            );

            expect(err).toBeUndefined();
            expect(results).toEqual(4);
        });

    });

    describe('Method: search', () => {

        test('Get an medication request using all implemented arguments', async () => {
            let args = {_id: '0', authoredon: '2015-03-01', category: 'inpatient', code: '1313112', context: 'f001', date: '2015-01-15T22:00:00+11:00',
                identifier: '12345', intendedDispenser: 'f001', intent: 'order', medication: 'med0316', patient: 'pat1',
                priority: 'routine', requester: 'f007', status: 'active', subject: 'Patient/pat1'};
            let contexts = {};
            let [err, docs] = await asyncHandler(
                medicationrequestService.search(args, contexts, logger)
            );

            // console.log(JSON.stringify(args));
            // console.log(JSON.stringify(docs));

            expect(err).toBeUndefined();
            expect(docs.length).toEqual(1);

            docs.forEach(doc => {
                expect(doc.id).toEqual(args._id);
                expect(doc.authoredOn).toEqual(args.authoredon);
                expect(doc.category.coding[0].system).toEqual('http://hl7.org/fhir/medication-request-category');
                expect(doc.category.coding[0].code).toEqual('inpatient');
                expect(doc.medicationCodeableConcept.coding[0].system).toEqual('http://www.nlm.nih.gov/research/umls/rxnorm');
                expect(doc.medicationCodeableConcept.coding[0].code).toEqual('1313112');
                expect(doc.context.reference).toEqual('Encounter/f001');
                expect(doc.dosageInstruction[0].timing.event[0]).toEqual(args.date);
                expect(doc.identifier[0].system).toEqual('http://www.bmc.nl/portal/prescriptions');
                expect(doc.identifier[0].value).toEqual('12345');
                expect(doc.dispenseRequest.performer.reference).toEqual('Organization/f001');
                expect(doc.intent).toEqual(args.intent);
                expect(doc.medicationReference.reference).toEqual('Medication/med0316');
                expect(doc.subject.reference).toEqual('Patient/pat1');
                expect(doc.priority).toEqual(args.priority);
                expect(doc.requester.agent.reference).toEqual('Practitioner/f007');
                expect(doc.status).toEqual(args.status);
                expect(doc.subject.reference).toEqual(args.subject);
            });

        });

    });

    describe('Method: searchById', () => {

        test('should correctly return a document', async () => {
            let args = { id: 'uscore-mo1' };
            let [ err, doc ] = await asyncHandler(
                medicationrequestService.searchById(args, logger)
            );

            expect(err).toBeUndefined();
            expect(doc.id).toEqual(args.id);
        });

    });

    describe('Method: remove', () => {

        // For these tests, let's do it in 3 steps
        // 1. Check the medicationrequest exists
        // 2. Delete an medicationrequest and make sure it does not throw
        // 3. Check the medicationrequest does not exist

        test('should successfully delete a document', async () => {

            // Look for this particular fixture
            let args = { id: 'uscore-mo1' };
            let [ err, doc ] = await asyncHandler(
                medicationrequestService.searchById(args, logger)
            );

            expect(err).toBeUndefined();
            expect(doc.id).toEqual(args.id);

            // Now delete this fixture
            let [ delete_err, _ ] = await asyncHandler(
                medicationrequestService.remove(args, logger)
            );

            // There is no response resolved from this promise, so just check for an error
            expect(delete_err).toBeUndefined();

            // Now query for the fixture again, there should be no documents
            let [ query_err, missing_doc ] = await asyncHandler(
                medicationrequestService.searchById(args, logger)
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
                    toJSON: () => MedicationRequestFixture
                },
                id: 'uscore-mo1'
            };

            // Delete the fixture incase it exists,
            // mongo won't throw if we delete something not there
            let [ delete_err, _ ] = await asyncHandler(
                medicationrequestService.remove(args, logger)
            );

            expect(delete_err).toBeUndefined();

            // Create the fixture, it expects two very specific args
            // The resource arg must be a class/object with a toJSON method
            let [ create_err, create_results ] = await asyncHandler(
                medicationrequestService.create(args, logger)
            );

            expect(create_err).toBeUndefined();
            // Response should contain an id so core can set appropriate location headers
            expect(create_results.id).toEqual(args.id);


            // Verify the new fixture exists
            let [ query_err, doc ] = await asyncHandler(
                medicationrequestService.searchById(args, logger)
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
            MedicationRequestFixture.status = 'preliminary';

            let args = {
                resource: {
                    toJSON: () => MedicationRequestFixture
                },
                id: 'uscore-mo1'
            };

            // Query for the original doc, this will ignore the resource arg
            let [ query_err, doc ] = await asyncHandler(
                medicationrequestService.searchById(args, logger)
            );

            expect(query_err).toBeUndefined();
            expect(doc.status).toEqual('active');

            // Update the original doc
            let [ update_err, update_results ] = await asyncHandler(
                medicationrequestService.update(args, logger)
            );

            expect(update_err).toBeUndefined();
            expect(update_results.id).toEqual(args.id);

            // Query the newly updated doc and make sure the status is correct
            let [ updated_err, updated_doc ] = await asyncHandler(
                medicationrequestService.searchById(args, logger)
            );

            expect(updated_err).toBeUndefined();
            expect(updated_doc.status).toEqual('preliminary');

        });

    });

});
