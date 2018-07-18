/* eslint-disable */
const ProcedureFixture = require('../../../fixtures/data/patient00/procedure00.json');
const { CLIENT, CLIENT_DB } = require('../../constants');
const asyncHandler = require('../../lib/async-handler');
const logger = require('../../testutils/logger.mock');
const procedureService = require('./procedure.service');
const { mongoConfig } = require('../../config');
const mongoClient = require('../../lib/mongo');
let globals = require('../../globals');

describe('Procedure Service Test', () => {

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
                procedureService.count(null, logger)
            );

            expect(err).toBeUndefined();
            expect(results).toEqual(2);
        });

    });

    describe('Method: search', () => {

      test('should return 2 procedures', async () => {
        let args = { patient: 'example', status: 'completed', code: 'http://snomed.info/sct|35637008', subject: 'Patient/example' };
          let contexts = {};
        let [ err, docs ] = await asyncHandler(
          procedureService.search(args, contexts, logger)
        );

        expect(err).toBeUndefined();
        expect(docs.length).toEqual(2);

        docs.forEach(doc => {
         expect(doc.subject.reference).toEqual(`Patient/${args.patient}`);
         expect(doc.status).toEqual(args.status);
         expect(doc.code.coding[0].system).toEqual('http://snomed.info/sct');
         expect(doc.code.coding[0].code).toEqual('35637008');
         expect(doc.subject.reference).toEqual(args.subject);
        });

      });

      test('testing some added search params', async () => {
        let args = { _id: '0', patient: 'example', category: '103693007', code: 'HZ30ZZZ1',
        context: 'Encounter/f202', definition: 'PlanDefinition/f201', encounter: 'f202',
      identifier: '12345', location: 'Location/1', partOf: 'Procedure/colonoscopy',
    performer: 'Practitioner/example', date: '2002-05-23' };
          let contexts = {};
        let [ err, docs ] = await asyncHandler(
          procedureService.search(args, contexts, logger)
        );

        expect(err).toBeUndefined();
        expect(docs.length).toEqual(1);

        docs.forEach(doc => {
            expect(doc.id).toEqual(args._id);
          expect(doc.subject.reference).toEqual(`Patient/${args.patient}`);
          expect(doc.category.coding[0].code).toEqual(args.category);
          expect(doc.code.coding[1].code).toEqual(args.code);
          expect(doc.context.reference).toEqual(args.context);
          expect(doc.definition[0].reference).toEqual(args.definition);
          expect(doc.context.reference).toEqual(`Encounter/${args.encounter}`);
          expect(doc.identifier[0].value).toEqual(args.identifier);
          expect(doc.location.reference).toEqual(args.location);
          expect(doc.partOf[0].reference).toEqual(args.partOf);
          expect(doc.performer[0].actor.reference).toEqual(args.performer);
          expect(doc.performedDateTime).toEqual('2002-05-23T04:30Z');
        });
      });
    });

    describe('Method: searchById', () => {

        test('should correctly return a document', async () => {
            let args = {id: '0'};
            let [err, doc] = await asyncHandler(
                procedureService.searchById(args, logger)
            );

            expect(err).toBeUndefined();
            expect(doc.id).toEqual(args.id);
        });

    });

    describe('Method: remove', () => {

        // For these tests, let's do it in 3 steps
        // 1. Check the procedure exists
        // 2. Delete a procedure and make sure it does not throw
        // 3. Check the procedure does not exist

        test('should successfully delete a document', async () => {

            // Look for this particular fixture
            let args = { id: '0' };
            let [ err, doc ] = await asyncHandler(
                procedureService.searchById(args, logger)
            );

            expect(err).toBeUndefined();
            expect(doc.id).toEqual(args.id);

            // Now delete this fixture
            let [ delete_err, _ ] = await asyncHandler(
                procedureService.remove(args, logger)
            );

            // There is no response resolved from this promise, so just check for an error
            expect(delete_err).toBeUndefined();

            // Now query for the fixture again, there should be no documents
            let [ query_err, missing_doc ] = await asyncHandler(
                procedureService.searchById(args, logger)
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
                    toJSON: () => ProcedureFixture
                },
                id: '0'
            };

            // Delete the fixture incase it exists,
            // mongo won't throw if we delete something not there
            let [ delete_err, _ ] = await asyncHandler(
                procedureService.remove(args, logger)
            );

            expect(delete_err).toBeUndefined();

            // Create the fixture, it expects two very specific args
            // The resource arg must be a class/object with a toJSON method
            let [ create_err, create_results ] = await asyncHandler(
                procedureService.create(args, logger)
            );

            expect(create_err).toBeUndefined();
            // Response should contain an id so core can set appropriate location headers
            expect(create_results.id).toEqual(args.id);


            // Verify the new fixture exists
            let [ query_err, doc ] = await asyncHandler(
                procedureService.searchById(args, logger)
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
            ProcedureFixture.text.status = 'preliminary';

            let args = {
                resource: {
                    toJSON: () => ProcedureFixture
                },
                id: '0'
            };

            // Query for the original doc, this will ignore the resource arg
            let [query_err, doc] = await asyncHandler(
                procedureService.searchById(args, logger)
            );

            expect(query_err).toBeUndefined();
            expect(doc.text.status).toEqual('generated');

            // Update the original doc
            let [update_err, update_results] = await asyncHandler(
                procedureService.update(args, logger)
            );

            expect(update_err).toBeUndefined();
            expect(update_results.id).toEqual(args.id);

            // Query the newly updated doc and make sure the status is correct
            let [updated_err, updated_doc] = await asyncHandler(
                procedureService.searchById(args, logger)
            );

            expect(updated_err).toBeUndefined();
            expect(updated_doc.text.status).toEqual('preliminary');

        });

    });

});
