/* eslint-disable */
const CareplanFixture = require('../../../fixtures/data/patient00/careplan00.json');
const { CLIENT, CLIENT_DB } = require('../../constants');
const asyncHandler = require('../../lib/async-handler');
const logger = require('../../testutils/logger.mock');
const careplanService = require('./careplan.service');
const { mongoConfig } = require('../../config');
const mongoClient = require('../../lib/mongo');
let globals = require('../../globals');

describe('CarePlan Service Test', () => {

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
                careplanService.count(null, logger)
            );

            expect(err).toBeUndefined();
            expect(results).toEqual(2);
        });

    });

    describe('Method: search', () => {

        test('test only using available arguments', async () => {
            let args = {_id: '0', activityCode: 'http://loinc.org|3141-9', activityReference: 'Appointment/example', basedOn: 'example', careTeam: 'example',
                category: 'http://snomed.info/sct|161832001', condition: '#p1', context: 'Encounter/home', definition: 'Questionnaire/example',
                encounter: 'home', goal: 'example', identifier: '12345', intent: 'plan', partOf: 'example', patient: 'example',
                performer: 'https://foo.com/fhir/Patient/example', replaces: 'example', status: 'active', subject: 'Patient/example',
              activityDate: '2013-09-13T05:00', date: '2014-09'};
            let contexts = {};
            let [err, docs] = await asyncHandler(
                careplanService.search(args, contexts, logger)
            );

            // console.log(JSON.stringify(args));

            expect(err).toBeUndefined();
            expect(docs.length).toEqual(1);

            docs.forEach(doc => {
                expect(doc.id).toEqual(args._id);
                expect(doc.activity[0].detail.code.coding[0].system).toEqual('http://loinc.org');
                expect(doc.activity[0].detail.code.coding[0].code).toEqual('3141-9');
                expect(doc.activity[0].reference.reference).toEqual(args.activityReference);
                expect(doc.basedOn[0].reference).toEqual(`CarePlan/${args.basedOn}`);
                expect(doc.careTeam[0].reference).toEqual(`CareTeam/${args.careTeam}`);
                expect(doc.category[0].coding[0].system).toEqual('http://snomed.info/sct');
                expect(doc.category[0].coding[0].code).toEqual('161832001');
                expect(doc.addresses[0].reference).toEqual(args.condition);
                expect(doc.context.reference).toEqual(args.context);
                expect(doc.definition[0].reference).toEqual(args.definition);
                expect(doc.context.reference).toEqual(`Encounter/${args.encounter}`);
                expect(doc.goal[0].reference).toEqual(`Goal/${args.goal}`);
                expect(doc.identifier[0].value).toEqual('12345');
                expect(doc.intent).toEqual(args.intent);
                expect(doc.partOf[0].reference).toEqual(`CarePlan/${args.partOf}`);
                expect(doc.subject.reference).toEqual(`Patient/${args.patient}`);
                expect(doc.activity[0].detail.performer[0].reference).toEqual('Patient/example');
                expect(doc.replaces[0].reference).toEqual(`CarePlan/${args.replaces}`);
                expect(doc.status).toEqual(args.status);
                expect(doc.subject.reference).toEqual(args.subject);
            });

        });

    });

    describe('Method: searchById', () => {

        test('should correctly return a document', async () => {
            let args = {id: '0'};
            let contexts = {};
            let [err, doc] = await asyncHandler(
                careplanService.searchById(args, contexts, logger)
            );

            expect(err).toBeUndefined();
            expect(doc.id).toEqual(args.id);
        });

    });

    describe('Method: remove', () => {

        // For these tests, let's do it in 3 steps
        // 1. Check the careplan exists
        // 2. Delete a careplan and make sure it does not throw
        // 3. Check the careplan does not exist

        test('should successfully delete a document', async () => {

            // Look for this particular fixture
            let args = { id: '0' };
            let contexts = {};
            let [ err, doc ] = await asyncHandler(
                careplanService.searchById(args, contexts, logger)
            );

            expect(err).toBeUndefined();
            expect(doc.id).toEqual(args.id);

            // Now delete this fixture
            let [ delete_err, _ ] = await asyncHandler(
                careplanService.remove(args, logger)
            );

            // There is no response resolved from this promise, so just check for an error
            expect(delete_err).toBeUndefined();

            // Now query for the fixture again, there should be no documents
            let [ query_err, missing_doc ] = await asyncHandler(
                careplanService.searchById(args, contexts, logger)
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
                    toJSON: () => CareplanFixture
                },
                id: '0'
            };
            let contexts = {};

            // Delete the fixture incase it exists,
            // mongo won't throw if we delete something not there
            let [ delete_err, _ ] = await asyncHandler(
                careplanService.remove(args, logger)
            );

            expect(delete_err).toBeUndefined();

            // Create the fixture, it expects two very specific args
            // The resource arg must be a class/object with a toJSON method
            let [ create_err, create_results ] = await asyncHandler(
                careplanService.create(args, logger)
            );

            expect(create_err).toBeUndefined();
            // Response should contain an id so core can set appropriate location headers
            expect(create_results.id).toEqual(args.id);


            // Verify the new fixture exists
            let [ query_err, doc ] = await asyncHandler(
                careplanService.searchById(args, contexts, logger)
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
            CareplanFixture.text.status = 'preliminary';

            let args = {
                resource: {
                    toJSON: () => CareplanFixture
                },
                id: '0'
            };
            let contexts = {};

            // Query for the original doc, this will ignore the resource arg
            let [query_err, doc] = await asyncHandler(
                careplanService.searchById(args, contexts, logger)
            );

            expect(query_err).toBeUndefined();
            expect(doc.text.status).toEqual('additional');

            // Update the original doc
            let [update_err, update_results] = await asyncHandler(
                careplanService.update(args, logger)
            );

            expect(update_err).toBeUndefined();
            expect(update_results.id).toEqual(args.id);

            // Query the newly updated doc and make sure the status is correct
            let [updated_err, updated_doc] = await asyncHandler(
                careplanService.searchById(args, contexts, logger)
            );

            expect(updated_err).toBeUndefined();
            expect(updated_doc.text.status).toEqual('preliminary');

        });

    });

});
