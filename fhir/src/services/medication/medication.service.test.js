/* eslint-disable */
const MedicationFixture = require('../../../fixtures/data/uscore/Medication-uscore-med1');
const { CLIENT, CLIENT_DB } = require('../../constants');
const asyncHandler = require('../../lib/async-handler');
const logger = require('../../testutils/logger.mock');
const medicationService = require('./medication.service');
const { mongoConfig } = require('../../config');
const mongoClient = require('../../lib/mongo');
let globals = require('../../globals');

describe('Medication Service Test', () => {

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

        test('should return 2 medications', async () => {
            let args = { code: 'http://www.nlm.nih.gov/research/umls/rxnorm|206765' };
            let [ err, docs ] = await asyncHandler(
                medicationService.search(args, logger)
            );

            expect(err).toBeUndefined();
            expect(docs.length).toEqual(2);

            docs.forEach(doc => {
                expect(doc.code.coding[0].system).toEqual('http://www.nlm.nih.gov/research/umls/rxnorm');
                expect(doc.code.coding[0].code).toEqual('206765');
            });

        });
        test('testing some added search params', async () => {
            let args = { container: 'http://snomed.info/sct|419672006',
            code: '206765', form: 'http://snomed.info/sct|385055001', ingredient: '#sub04',
          ingredientCode: 'http://www.nlm.nih.gov/research/umls/rxnorm|203134', manufacturer: '#org7',
        overTheCounter: 'false', packageItem: '#med500', packageItemCode: 'http://snomed.info/sct|324337001',
      status: 'active' };
            let [ err, docs ] = await asyncHandler(
                medicationService.search(args, logger)
            );

            expect(err).toBeUndefined();
            expect(docs.length).toEqual(1);

            docs.forEach(doc => {
                expect(doc.package.container.coding[0].system).toEqual('http://snomed.info/sct');
                expect(doc.package.container.coding[0].code).toEqual('419672006');
                expect(doc.code.coding[0].system).toEqual('http://www.nlm.nih.gov/research/umls/rxnorm');
                expect(doc.code.coding[0].code).toEqual('206765');
                expect(doc.form.coding[0].system).toEqual('http://snomed.info/sct');
                expect(doc.form.coding[0].code).toEqual('385055001');
                expect(doc.ingredient[0].itemReference.reference).toEqual('#sub04');
                expect(doc.ingredient[1].itemCodeableConcept.coding[0].system).toEqual('http://www.nlm.nih.gov/research/umls/rxnorm');
                expect(doc.ingredient[1].itemCodeableConcept.coding[0].code).toEqual('203134');
                expect(doc.manufacturer.reference).toEqual('#org7');
                expect(doc.isOverTheCounter).toEqual(false);
                expect(doc.package.content[1].itemReference.reference).toEqual('#med500');
                expect(doc.package.content[0].itemCodeableConcept.coding[0].system).toEqual('http://snomed.info/sct');
                expect(doc.package.content[0].itemCodeableConcept.coding[0].code).toEqual('324337001');
                expect(doc.status).toEqual('active');
            });
        });
    });

    describe('Method: count', () => {

        test('should correctly pass back the count', async () => {
            let [err, results] = await asyncHandler(
                medicationService.count(null, logger)
            );

            expect(err).toBeUndefined();
            expect(results).toEqual(5);
        });

    });

    describe('Method: searchById', () => {

        test('should correctly return a document', async () => {
            let args = {id: '0'};
            let [err, doc] = await asyncHandler(
                medicationService.searchById(args, logger)
            );

            expect(err).toBeUndefined();
            expect(doc.id).toEqual(args.id);
        });

    });

    describe('Method: remove', () => {

        // For these tests, let's do it in 3 steps
        // 1. Check the medication exists
        // 2. Delete a medication and make sure it does not throw
        // 3. Check the medication does not exist

        test('should successfully delete a document', async () => {

            // Look for this particular fixture
            let args = { id: '0' };
            let [ err, doc ] = await asyncHandler(
                medicationService.searchById(args, logger)
            );

            expect(err).toBeUndefined();
            expect(doc.id).toEqual(args.id);

            // Now delete this fixture
            let [ delete_err, _ ] = await asyncHandler(
                medicationService.remove(args, logger)
            );

            // There is no response resolved from this promise, so just check for an error
            expect(delete_err).toBeUndefined();

            // Now query for the fixture again, there should be no documents
            let [ query_err, missing_doc ] = await asyncHandler(
                medicationService.searchById(args, logger)
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
                    toJSON: () => MedicationFixture
                },
                id: '0'
            };

            // Delete the fixture incase it exists,
            // mongo won't throw if we delete something not there
            let [ delete_err, _ ] = await asyncHandler(
                medicationService.remove(args, logger)
            );

            expect(delete_err).toBeUndefined();

            // Create the fixture, it expects two very specific args
            // The resource arg must be a class/object with a toJSON method
            let [ create_err, create_results ] = await asyncHandler(
                medicationService.create(args, logger)
            );

            expect(create_err).toBeUndefined();
            // Response should contain an id so core can set appropriate location headers
            expect(create_results.id).toEqual(args.id);


            // Verify the new fixture exists
            let [ query_err, doc ] = await asyncHandler(
                medicationService.searchById(args, logger)
            );

            expect(query_err).toBeUndefined();
            expect(doc.id).toEqual(args.id);

        });

    });

    describe('Method: update', () => {

        // Let's check for the fixture's text status and then try to change it
        // 1. Query fixture for text status
        // 2. Update text status
        // 3. Query fixture for updated text status

        test('should successfully update a document', async () => {
            // Update the text status
            MedicationFixture.text.status = 'preliminary';

            let args = {
                resource: {
                    toJSON: () => MedicationFixture
                },
                id: '0'
            };

            // Query for the original doc, this will ignore the resource arg
            let [query_err, doc] = await asyncHandler(
                medicationService.searchById(args, logger)
            );

            expect(query_err).toBeUndefined();
            expect(doc.text.status).toEqual('generated');

            // Update the original doc
            let [update_err, update_results] = await asyncHandler(
                medicationService.update(args, logger)
            );

            expect(update_err).toBeUndefined();
            expect(update_results.id).toEqual(args.id);

            // Query the newly updated doc and make sure the text status is correct
            let [updated_err, updated_doc] = await asyncHandler(
                medicationService.searchById(args, logger)
            );

            expect(updated_err).toBeUndefined();
            expect(updated_doc.text.status).toEqual('preliminary');

        });

    });

});
