/* eslint-disable */
const DeviceFixture = require('../../../fixtures/data/patient00/device00.json');
const { CLIENT, CLIENT_DB } = require('../../constants');
const asyncHandler = require('../../lib/async-handler');
const logger = require('../../testutils/logger.mock');
const deviceService = require('./device.service');
const { mongoConfig } = require('../../config');
const mongoClient = require('../../lib/mongo');
let globals = require('../../globals');

describe('Device Service Test', () => {

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

        test('should return 2 devices', async () => {
            let args = { patient: 'example' };
            let contexts = {};
            let [ err, docs ] = await asyncHandler(
                deviceService.search(args, contexts, logger)
            );

            expect(err).toBeUndefined();
            expect(docs.length).toEqual(2);

            docs.forEach(doc => {
                expect(doc.patient.reference).toEqual(`Patient/${args.patient}`);
            });

        });
        test('testing some added search params', async () => {
            let args = { _id: '0', patient: 'example', deviceName: 'Fh',
                identifier: 'http://acme.com/devices/pacemakers/octane/serial|1234-5678-90AB-CDEF',
                manufacturer: 'Acme Devices, Inc', model: 'PM/Octane 2014', status: 'active',
                type: 'http://snomed.info/sct|468063009', udiDi: '00844588003288',
                url: 'http://acme.com/goodhealth/ehr/', location: 'Test/f203',
                udiCarrier:'(01)09504000059118(17)141120(10)7654321D(21)10987654d321',
                organization: 'Organization/2.16.840.1.113883.19.5' };
            let contexts = {};
            let [ err, docs ] = await asyncHandler(
                deviceService.search(args, contexts, logger)
            );

            expect(err).toBeUndefined();
            expect(docs.length).toEqual(1);

            docs.forEach(doc => {
                expect(doc.id).toEqual(args._id);
                expect(doc.patient.reference).toEqual(`Patient/${args.patient}`);
                expect(doc.udi.name).toEqual('FHIR® Hip System');
                expect(doc.identifier[0].system).toEqual('http://acme.com/devices/pacemakers/octane/serial');
                expect(doc.identifier[0].value).toEqual('1234-5678-90AB-CDEF');
                expect(doc.manufacturer).toEqual('Acme Devices, Inc');
                expect(doc.model).toEqual('PM/Octane 2014');
                expect(doc.status).toEqual('active');
                expect(doc.type.coding[0].system).toEqual('http://snomed.info/sct');
                expect(doc.type.coding[0].code).toEqual('468063009');
                expect(doc.udi.deviceIdentifier).toEqual('00844588003288');
                expect(doc.url).toEqual('http://acme.com/goodhealth/ehr/');
                expect(doc.location.reference).toEqual('Test/f203');
                expect(doc.udi.carrierHRF).toEqual('(01)09504000059118(17)141120(10)7654321D(21)10987654d321');
                expect(doc.owner.reference).toEqual('Organization/2.16.840.1.113883.19.5');
            });
        });
    });

    describe('Method: count', () => {

        test('should correctly pass back the count', async () => {
            let [err, results] = await asyncHandler(
                deviceService.count(null, logger)
            );

            expect(err).toBeUndefined();
            expect(results).toEqual(2);
        });

    });

    describe('Method: searchById', () => {

        test('should correctly return a document', async () => {
            let args = {id: '0'};
            let contexts = {};
            let [err, doc] = await asyncHandler(
                deviceService.searchById(args, contexts, logger)
            );

            expect(err).toBeUndefined();
            expect(doc.id).toEqual(args.id);
        });

    });

    describe('Method: remove', () => {

        // For these tests, let's do it in 3 steps
        // 1. Check the device exists
        // 2. Delete an device and make sure it does not throw
        // 3. Check the device does not exist

        test('should successfully delete a document', async () => {

            // Look for this particular fixture
            let args = { id: '0' };
            let contexts = {};
            let [ err, doc ] = await asyncHandler(
                deviceService.searchById(args, contexts, logger)
            );

            expect(err).toBeUndefined();
            expect(doc.id).toEqual(args.id);

            // Now delete this fixture
            let [ delete_err, _ ] = await asyncHandler(
                deviceService.remove(args, logger)
            );

            // There is no response resolved from this promise, so just check for an error
            expect(delete_err).toBeUndefined();

            // Now query for the fixture again, there should be no documents
            let [ query_err, missing_doc ] = await asyncHandler(
                deviceService.searchById(args, contexts, logger)
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
                    toJSON: () => DeviceFixture
                },
                id: '0'
            };
            let contexts = {};

            // Delete the fixture incase it exists,
            // mongo won't throw if we delete something not there
            let [ delete_err, _ ] = await asyncHandler(
                deviceService.remove(args, logger)
            );

            expect(delete_err).toBeUndefined();

            // Create the fixture, it expects two very specific args
            // The resource arg must be a class/object with a toJSON method
            let [ create_err, create_results ] = await asyncHandler(
                deviceService.create(args, logger)
            );

            expect(create_err).toBeUndefined();
            // Response should contain an id so core can set appropriate location headers
            expect(create_results.id).toEqual(args.id);


            // Verify the new fixture exists
            let [ query_err, doc ] = await asyncHandler(
                deviceService.searchById(args, contexts, logger)
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
            DeviceFixture.text.status = 'preliminary';

            let args = {
                resource: {
                    toJSON: () => DeviceFixture
                },
                id: '0'
            };
            let contexts = {};

            // Query for the original doc, this will ignore the resource arg
            let [query_err, doc] = await asyncHandler(
                deviceService.searchById(args, contexts, logger)
            );

            expect(query_err).toBeUndefined();
            expect(doc.text.status).toEqual('generated');

            // Update the original doc
            let [update_err, update_results] = await asyncHandler(
                deviceService.update(args, logger)
            );

            expect(update_err).toBeUndefined();
            expect(update_results.id).toEqual(args.id);

            // Query the newly updated doc and make sure the status is correct
            let [updated_err, updated_doc] = await asyncHandler(
                deviceService.searchById(args, contexts, logger)
            );

            expect(updated_err).toBeUndefined();
            expect(updated_doc.text.status).toEqual('preliminary');

        });

    });

});
