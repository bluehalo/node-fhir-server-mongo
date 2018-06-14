/* eslint-disable */
const AllergyIntoleranceFixture = require('../../../fixtures/data/patient01/allergyintolerance01.json');
const { CLIENT, CLIENT_DB } = require('../../constants');
const asyncHandler = require('../../lib/async-handler');
const logger = require('../../testutils/logger.mock');
const allergyintoleranceService = require('./allergyintolerance.service');
const { mongoConfig } = require('../../config');
const mongoClient = require('../../lib/mongo');
let globals = require('../../globals');

describe('AllergyIntolerance Service Test', () => {

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

    describe('Method: getCount', () => {

        test('should correctly pass back the count', async () => {
            let [err, results] = await asyncHandler(
                allergyintoleranceService.getCount(null, logger)
            );

            expect(err).toBeUndefined();
            expect(results).toEqual(52);
        });

    });

    describe('Method: getAllergyIntolerance', () => {

        test('test only using required arguments', async () => {
            let args = { patient: 'example', verificationStatus: 'confirmed'};
            let [ err, docs ] = await asyncHandler(
                allergyintoleranceService.getAllergyIntolerance(args, logger)
            );

            // console.log(JSON.stringify(args));

            expect(err).toBeUndefined();
            expect(docs.length).toEqual(2);

            docs.forEach(doc => {
                expect(doc.patient.reference).toEqual(`Patient/${args.patient}`);
                expect(doc.verificationStatus).toEqual(args.verificationStatus);
            });

        });

        test('find all documents that use the same system for manifestation', async () => {
            let args = { manifestation: 'http://snomed.info/sct|', patient: 'example', verificationStatus: 'confirmed'};
            let [ err, docs ] = await asyncHandler(
                allergyintoleranceService.getAllergyIntolerance(args, logger)
            );

            // console.log(JSON.stringify(args));

            expect(err).toBeUndefined();
            expect(docs.length).toEqual(2);

            docs.forEach(doc => {
                expect(doc.reaction[0].manifestation[0].coding[0].system).toEqual('http://snomed.info/sct');
            });

        });

        test('test all codeable concept arguments using only a code without a \'|\'', async () => {
            let args = { code: 'N0000175503', identifier: '49476534', manifestation: '64305001', patient: 'example',
                route: '34206005', verificationStatus: 'confirmed'};
            let [ err, docs ] = await asyncHandler(
                allergyintoleranceService.getAllergyIntolerance(args, logger)
            );

            // console.log(JSON.stringify(args));

            expect(err).toBeUndefined();
            expect(docs.length).toEqual(1);

            docs.forEach(doc => {
                expect(doc.code.coding[1].code).toEqual('N0000175503');
                expect(doc.identifier[0].value).toEqual('49476534');
                expect(doc.reaction[1].manifestation[0].coding[0].code).toEqual('64305001');
                expect(doc.reaction[0].exposureRoute.coding[0].code).toEqual('34206005');
            });

        });

        test('test using all arguments', async () => {
            let args = { category: 'medication', clinicalStatus: 'active', code: 'http://hl7.org/fhir/ndfrt|N0000175503',
                criticality: 'low', date: '2014-10-09T14:58:00+11:00', identifier: 'http://acme.com/ids/patients/risks|49476534', lastDate: '2012-06',
                manifestation: 'http://snomed.info/sct|64305001', onset: '2004', patient: 'example', recorder: 'example',
                route: 'http://snomed.info/sct|34206005', severity: 'severe', type: 'allergy', verificationStatus: 'confirmed'};
            let [ err, docs ] = await asyncHandler(
                allergyintoleranceService.getAllergyIntolerance(args, logger)
            );

            // console.log(JSON.stringify(docs));

            expect(err).toBeUndefined();
            expect(docs.length).toEqual(1);

            docs.forEach(doc => {
                expect(doc.category[1]).toEqual(args.category);
                expect(doc.clinicalStatus).toEqual(args.clinicalStatus);
                expect(doc.code.coding[1].system).toEqual('http://hl7.org/fhir/ndfrt');
                expect(doc.code.coding[1].code).toEqual('N0000175503');
                expect(doc.criticality).toEqual(args.criticality);
                expect(doc.assertedDate).toEqual(args.date);
                expect(doc.identifier[0].system).toEqual('http://acme.com/ids/patients/risks');
                expect(doc.identifier[0].value).toEqual('49476534');
                expect(doc.lastOccurrence).toEqual(args.lastDate);
                expect(doc.reaction[1].manifestation[0].coding[0].system).toEqual('http://snomed.info/sct');
                expect(doc.reaction[1].manifestation[0].coding[0].code).toEqual('64305001');
                expect(doc.reaction[1].onset).toEqual(args.onset);
                expect(doc.patient.reference).toEqual(`Patient/${args.patient}`);
                expect(doc.reaction[0].exposureRoute.coding[0].system).toEqual('http://snomed.info/sct');
                expect(doc.reaction[0].exposureRoute.coding[0].code).toEqual('34206005');
                expect(doc.reaction[0].severity).toEqual(args.severity);
                expect(doc.type).toEqual(args.type);
                expect(doc.verificationStatus).toEqual(args.verificationStatus);
            });

        });

    });

    describe('Method: getAllergyIntoleranceById', () => {

        test('should correctly return a document', async () => {
            let args = { id: '8' };
            let [ err, doc ] = await asyncHandler(
                allergyintoleranceService.getAllergyIntoleranceById(args, logger)
            );

            expect(err).toBeUndefined();
            expect(doc.id).toEqual(args.id);
        });

    });

    describe('Method: deleteAllergyIntolerance', () => {

        // For these tests, let's do it in 3 steps
        // 1. Check the allergyintolerance exists
        // 2. Delete an allergyintolerance and make sure it does not throw
        // 3. Check the allergyintolerance does not exist

        test('should successfully delete a document', async () => {

            // Look for this particular fixture
            let args = { id: '1' };
            let [ err, doc ] = await asyncHandler(
                allergyintoleranceService.getAllergyIntoleranceById(args, logger)
            );

            expect(err).toBeUndefined();
            expect(doc.id).toEqual(args.id);

            // Now delete this fixture
            let [ delete_err, _ ] = await asyncHandler(
                allergyintoleranceService.deleteAllergyIntolerance(args, logger)
            );

            // There is no response resolved from this promise, so just check for an error
            expect(delete_err).toBeUndefined();

            // Now query for the fixture again, there should be no documents
            let [ query_err, missing_doc ] = await asyncHandler(
                allergyintoleranceService.getAllergyIntoleranceById(args, logger)
            );

            expect(query_err).toBeUndefined();
            expect(missing_doc).toBeNull();

        });

    });

    describe('Method: createAllergyIntolerance', () => {

        // This Fixture was previously deleted, we are going to ensure before creating it
        // 1. Delete fixture
        // 2. Create fixture
        // 3. Query for fixture

        test('should successfully create a document', async () => {

            // Look for this particular fixture
            let args = {
                resource: {
                    toJSON: () => AllergyIntoleranceFixture
                },
                id: '1'
            };

            // Delete the fixture incase it exists,
            // mongo won't throw if we delete something not there
            let [ delete_err, _ ] = await asyncHandler(
                allergyintoleranceService.deleteAllergyIntolerance(args, logger)
            );

            expect(delete_err).toBeUndefined();

            // Create the fixture, it expects two very specific args
            // The resource arg must be a class/object with a toJSON method
            let [ create_err, create_results ] = await asyncHandler(
                allergyintoleranceService.createAllergyIntolerance(args, logger)
            );

            expect(create_err).toBeUndefined();
            // Response should contain an id so core can set appropriate location headers
            expect(create_results.id).toEqual(args.id);


            // Verify the new fixture exists
            let [ query_err, doc ] = await asyncHandler(
                allergyintoleranceService.getAllergyIntoleranceById(args, logger)
            );

            expect(query_err).toBeUndefined();
            expect(doc.id).toEqual(args.id);

        });

    });

    describe('Method: updateAllergyIntolerance', () => {

        // Let's check for the fixture's status and then try to change it
        // 1. Query fixture for status
        // 2. Update status
        // 3. Query fixture for updated status

        test('should successfully update a document', async () => {
            // Update the status
            AllergyIntoleranceFixture.status = 'preliminary';

            let args = {
                resource: {
                    toJSON: () => AllergyIntoleranceFixture
                },
                id: '1'
            };

            // Query for the original doc, this will ignore the resource arg
            let [query_err, doc] = await asyncHandler(
                allergyintoleranceService.getAllergyIntoleranceById(args, logger)
            );

            expect(query_err).toBeUndefined();
            expect(doc.status).toEqual('confirmed');

            // Update the original doc
            let [update_err, update_results] = await asyncHandler(
                allergyintoleranceService.updateAllergyIntolerance(args, logger)
            );

            expect(update_err).toBeUndefined();
            expect(update_results.id).toEqual(args.id);

            // Query the newly updated doc and make sure the status is correct
            let [updated_err, updated_doc] = await asyncHandler(
                allergyintoleranceService.getAllergyIntoleranceById(args, logger)
            );

            expect(updated_err).toBeUndefined();
            expect(updated_doc.status).toEqual('preliminary');

        });

    });

});
