/* eslint-disable */
const ProcedureFixture = require('../../../fixtures/data/uscore/Procedure-rehab.json');
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
            expect(results).toEqual(1);
        });

    });

    // describe('Method: search', () => {
    //
    //   test('should return 2 procedures', async () => {
    //     let args = { patient: 'rehab', status: 'completed', code: 'http://snomed.info/sct|35637008' };
    //     let [ err, docs ] = await asyncHandler(
    //       procedureService.search(args, logger)
    //     );
    //
    //     expect(err).toBeUndefined();
    //     expect(docs.length).toEqual(1);
    //
    //     docs.forEach(doc => {
    //      expect(doc.subject.reference).toEqual(`Patient/${args.patient}`);
    //      expect(doc.status).toEqual(args.status);
    //      expect(doc.code.coding[0].system).toEqual('http://snomed.info/sct');
    //      expect(doc.code.coding[0].code).toEqual('35637008');
    //     });
    //
    //   });
    //
    //   test('testing some added search params', async () => {
    //     let args = { patient: 'example', category: '103693007'};
    //     let [ err, docs ] = await asyncHandler(
    //       procedureService.search(args, logger)
    //     );
    //
    //     expect(err).toBeUndefined();
    //     expect(docs.length).toEqual(1);
    //
    //     docs.forEach(doc => {
    //       expect(doc.subject.reference).toEqual(`Patient/${args.patient}`);
    //       expect(doc.category.coding[0].code).toEqual(args.category);
    //     });
    //   });
    // });

    describe('Method: searchById', () => {

        test('should correctly return a document', async () => {
            let args = {id: 'rehab'};
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
            let args = { id: 'rehab' };
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
                id: 'rehab'
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
            ProcedureFixture.status = 'preliminary';

            let args = {
                resource: {
                    toJSON: () => ProcedureFixture
                },
                id: 'rehab'
            };

            // Query for the original doc, this will ignore the resource arg
            let [query_err, doc] = await asyncHandler(
                procedureService.searchById(args, logger)
            );

            expect(query_err).toBeUndefined();
            expect(doc.status).toEqual('completed');

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
            expect(updated_doc.status).toEqual('preliminary');

        });

    });

});
