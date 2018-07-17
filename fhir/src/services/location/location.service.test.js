/* eslint-disable */
const LocationFixture = require('../../../fixtures/data/uscore/Location-hl7east.json');
const { CLIENT, CLIENT_DB } = require('../../constants');
const asyncHandler = require('../../lib/async-handler');
const logger = require('../../testutils/logger.mock');
const locationService = require('./location.service');
const { mongoConfig } = require('../../config');
const mongoClient = require('../../lib/mongo');
let globals = require('../../globals');

describe('Location Service Test', () => {

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
                locationService.count(null, logger)
            );

            expect(err).toBeUndefined();
            expect(results).toEqual(2);
        });

    });

    describe('Method: search', () => {

        test('Get a location using all implemented arguments', async () => {
            let args = {_id: '0', address: 'Galapagosweg 91, Building A, Den Burg, 9105 PZ Maryland NLD', addressCity: 'deN',
                addressCountry: 'N', addressPostalCode: '910', addressState: 'MarY', addressUse: 'work', endpoint: 'example',
                identifier: 'B1-S.F2', name: 'South', operationalStatus: 'http://hl7.org/fhir/v2/0116|H', organization: 'f001',
                partof: '1', status: 'active', type: 'http://hl7.org/fhir/v3/RoleCode|'};
            let [err, docs] = await asyncHandler(
                locationService.search(args, logger)
            );

            // console.log(JSON.stringify(args));
            // console.log(JSON.stringify(docs));

            expect(err).toBeUndefined();
            expect(docs.length).toEqual(1);

            docs.forEach(doc => {
                expect(doc.id).toEqual(args._id);
                expect(doc.address.line[0]).toEqual('Galapagosweg 91, Building A');
                expect(doc.address.city).toEqual('Den Burg');
                expect(doc.address.country).toEqual('NLD');
                expect(doc.address.postalCode).toEqual('9105 PZ');
                expect(doc.address.state).toEqual('Maryland');
                expect(doc.address.use).toEqual(args.addressUse);
                expect(doc.endpoint[0].reference).toEqual(`Endpoint/${args.endpoint}`);
                expect(doc.identifier[0].value).toEqual('B1-S.F2');
                expect(doc.name).toEqual('South Wing, second floor');
                expect(doc.operationalStatus.system).toEqual('http://hl7.org/fhir/v2/0116');
                expect(doc.operationalStatus.code).toEqual('H');
                expect(doc.managingOrganization.reference).toEqual(`Organization/${args.organization}`);
                expect(doc.partOf.reference).toEqual(`Location/${args.partof}`);
                expect(doc.status).toEqual(args.status);
                expect(doc.type.coding[0].system).toEqual('http://hl7.org/fhir/v3/RoleCode');
            });

        });

    });

    describe('Method: searchById', () => {

        test('should correctly return a document', async () => {
            let args = {id: 'hl7east'};
            let [err, doc] = await asyncHandler(
                locationService.searchById(args, logger)
            );

            expect(err).toBeUndefined();
            expect(doc.id).toEqual(args.id);
        });

    });

    describe('Method: remove', () => {

        // For these tests, let's do it in 3 steps
        // 1. Check the location exists
        // 2. Delete a location and make sure it does not throw
        // 3. Check the location does not exist

        test('should successfully delete a document', async () => {

            // Look for this particular fixture
            let args = { id: 'hl7east' };
            let [ err, doc ] = await asyncHandler(
                locationService.searchById(args, logger)
            );

            expect(err).toBeUndefined();
            expect(doc.id).toEqual(args.id);

            // Now delete this fixture
            let [ delete_err, _ ] = await asyncHandler(
                locationService.remove(args, logger)
            );

            // There is no response resolved from this promise, so just check for an error
            expect(delete_err).toBeUndefined();

            // Now query for the fixture again, there should be no documents
            let [ query_err, missing_doc ] = await asyncHandler(
                locationService.searchById(args, logger)
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
                    toJSON: () => LocationFixture
                },
                id: 'hl7east'
            };

            // Delete the fixture incase it exists,
            // mongo won't throw if we delete something not there
            let [ delete_err, _ ] = await asyncHandler(
                locationService.remove(args, logger)
            );

            expect(delete_err).toBeUndefined();

            // Create the fixture, it expects two very specific args
            // The resource arg must be a class/object with a toJSON method
            let [ create_err, create_results ] = await asyncHandler(
                locationService.create(args, logger)
            );

            expect(create_err).toBeUndefined();
            // Response should contain an id so core can set appropriate location headers
            expect(create_results.id).toEqual(args.id);


            // Verify the new fixture exists
            let [ query_err, doc ] = await asyncHandler(
                locationService.searchById(args, logger)
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
            LocationFixture.text.status = 'preliminary';

            let args = {
                resource: {
                    toJSON: () => LocationFixture
                },
                id: 'hl7east'
            };

            // Query for the original doc, this will ignore the resource arg
            let [query_err, doc] = await asyncHandler(
                locationService.searchById(args, logger)
            );

            expect(query_err).toBeUndefined();
            expect(doc.text.status).toEqual('generated');

            // Update the original doc
            let [update_err, update_results] = await asyncHandler(
                locationService.update(args, logger)
            );

            expect(update_err).toBeUndefined();
            expect(update_results.id).toEqual(args.id);

            // Query the newly updated doc and make sure the status is correct
            let [updated_err, updated_doc] = await asyncHandler(
                locationService.searchById(args, logger)
            );

            expect(updated_err).toBeUndefined();
            expect(updated_doc.text.status).toEqual('preliminary');

        });

    });

});
