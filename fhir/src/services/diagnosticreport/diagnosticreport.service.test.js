/* eslint-disable */
const DiagnosticReportFixture = require('../../../fixtures/data/uscore/DiagnosticReport-cbc.json');
const { CLIENT, CLIENT_DB } = require('../../constants');
const asyncHandler = require('../../lib/async-handler');
const logger = require('../../testutils/logger.mock');
const diagnosticreportService = require('./diagnosticreport.service');
const { mongoConfig } = require('../../config');
const mongoClient = require('../../lib/mongo');
let globals = require('../../globals');

describe('DiagnosticReport Service Test', () => {

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
                diagnosticreportService.count(null, logger)
            );

            expect(err).toBeUndefined();
            expect(results).toEqual(4);
        });

    });

    describe('Method: search', () => {

        test('should correctly return a specific diagnostic report using all arguments', async () => {
            let args = {_id: '0', basedOn: '#req', category: '252275004', code: '58410-2', context: 'example', date: '2011-03-04T08:30:00+11:00',
                diagnosis: '188340000', encounter: 'Encounter/example', identifier: 'nr1239044',
                image: 'Media/1.2.840.11361907579238403408700.3.0.14.19970327150033', issued: '2013-05-15T19:32:52+01:00',
                patient: 'f001', performer: 'f001', result: 'Observation/f001', specimen: 'genetics-example2',
                status: 'final', subject: 'Patient/f001'};
            let contexts = {};
            let [err, docs] = await asyncHandler(
                diagnosticreportService.search(args, contexts, logger)
            );

            expect(err).toBeUndefined();
            expect(docs.length).toEqual(1);

            docs.forEach(doc => {
                expect(doc.id).toEqual(args._id);
                expect(doc.basedOn[0].reference).toEqual(args.basedOn);
                expect(doc.category.coding[0].system).toEqual('http://snomed.info/sct');
                expect(doc.category.coding[0].code).toEqual('252275004');
                expect(doc.code.coding[0].system).toEqual('http://loinc.org');
                expect(doc.code.coding[0].code).toEqual('58410-2');
                expect(doc.context.reference).toEqual('Encounter/example');
                expect(doc.effectiveDateTime).toEqual(args.date);
                expect(doc.codedDiagnosis[0].coding[0].system).toEqual('http://snomed.info/sct');
                expect(doc.codedDiagnosis[0].coding[0].code).toEqual('188340000');
                expect(doc.context.reference).toEqual('Encounter/example');
                expect(doc.identifier[0].system).toEqual('http://www.bmc.nl/zorgportal/identifiers/reports');
                expect(doc.identifier[0].value).toEqual('nr1239044');
                expect(doc.image[0].link.reference).toEqual('Media/1.2.840.11361907579238403408700.3.0.14.19970327150033');
                expect(doc.issued).toEqual(args.issued);
                expect(doc.subject.reference).toEqual('Patient/f001');
                expect(doc.performer[0].actor.reference).toEqual('Organization/f001');
                expect(doc.result[0].reference).toEqual('Observation/f001');
                expect(doc.specimen[0].reference).toEqual('Specimen/genetics-example2');
                expect(doc.status).toEqual(args.status);
                expect(doc.subject.reference).toEqual('Patient/f001');
            });

        });

    });

    describe('Method: searchById', () => {

        test('should correctly return a document', async () => {
            let args = {id: 'cbc'};
            let [err, doc] = await asyncHandler(
                diagnosticreportService.searchById(args, logger)
            );

            expect(err).toBeUndefined();
            expect(doc.id).toEqual(args.id);
        });

    });

    describe('Method: remove', () => {

        // For these tests, let's do it in 3 steps
        // 1. Check the diagnosticreport exists
        // 2. Delete an diagnosticreport and make sure it does not throw
        // 3. Check the diagnosticreport does not exist

        test('should successfully delete a document', async () => {

            // Look for this particular fixture
            let args = { id: 'cbc' };
            let [ err, doc ] = await asyncHandler(
                diagnosticreportService.searchById(args, logger)
            );

            expect(err).toBeUndefined();
            expect(doc.id).toEqual(args.id);

            // Now delete this fixture
            let [ delete_err, _ ] = await asyncHandler(
                diagnosticreportService.remove(args, logger)
            );

            // There is no response resolved from this promise, so just check for an error
            expect(delete_err).toBeUndefined();

            // Now query for the fixture again, there should be no documents
            let [ query_err, missing_doc ] = await asyncHandler(
                diagnosticreportService.searchById(args, logger)
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
                    toJSON: () => DiagnosticReportFixture
                },
                id: 'cbc'
            };

            // Delete the fixture incase it exists,
            // mongo won't throw if we delete something not there
            let [ delete_err, _ ] = await asyncHandler(
                diagnosticreportService.remove(args, logger)
            );

            expect(delete_err).toBeUndefined();

            // Create the fixture, it expects two very specific args
            // The resource arg must be a class/object with a toJSON method
            let [ create_err, create_results ] = await asyncHandler(
                diagnosticreportService.create(args, logger)
            );

            expect(create_err).toBeUndefined();
            // Response should contain an id so core can set appropriate location headers
            expect(create_results.id).toEqual(args.id);


            // Verify the new fixture exists
            let [ query_err, doc ] = await asyncHandler(
                diagnosticreportService.searchById(args, logger)
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
            DiagnosticReportFixture.status = 'preliminary';

            let args = {
                resource: {
                    toJSON: () => DiagnosticReportFixture
                },
                id: 'cbc'
            };

            // Query for the original doc, this will ignore the resource arg
            let [ query_err, doc ] = await asyncHandler(
                diagnosticreportService.searchById(args, logger)
            );

            expect(query_err).toBeUndefined();
            expect(doc.status).toEqual('final');

            // Update the original doc
            let [ update_err, update_results ] = await asyncHandler(
                diagnosticreportService.update(args, logger)
            );

            expect(update_err).toBeUndefined();
            expect(update_results.id).toEqual(args.id);

            // Query the newly updated doc and make sure the status is correct
            let [ updated_err, updated_doc ] = await asyncHandler(
                diagnosticreportService.searchById(args, logger)
            );

            expect(updated_err).toBeUndefined();
            expect(updated_doc.status).toEqual('preliminary');

        });

    });

});
