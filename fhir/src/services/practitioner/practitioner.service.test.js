/* eslint-disable */
const PractitionerFixture = require('../../../fixtures/data/patient00/practitioner00.json');
const { CLIENT, CLIENT_DB } = require('../../constants');
const asyncHandler = require('../../lib/async-handler');
const logger = require('../../testutils/logger.mock');
const practitionerService = require('./practitioner.service');
const { mongoConfig } = require('../../config');
const mongoClient = require('../../lib/mongo');
let globals = require('../../globals');

describe('Practitioner Service Test', () => {

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
                practitionerService.count(null, logger)
            );

            expect(err).toBeUndefined();
            expect(results).toEqual(3);
        });

    });

    describe('Method: search', () => {

        test('should return 2 practitioners', async () => {
            let args = { address: '1003 Healthcare Dr', addressCity: 'Amhers', addressPostalCode: '0100',
          addressState: 'MA', addressUse: 'ho', family: 'Bone', given: 'Ron',
          identifier: 'http://www.acme.org/practitioners|25456' };
            let [ err, docs ] = await asyncHandler(
                practitionerService.search(args, logger)
            );

            expect(err).toBeUndefined();
            expect(docs.length).toEqual(2);

            docs.forEach(doc => {
                expect(doc.address[0].line[0]).toEqual('1003 Healthcare Drive');
                expect(doc.address[0].city).toEqual('Amherst');
                expect(doc.address[0].postalCode).toEqual('01002');
                expect(doc.address[0].state).toEqual('MA');
                expect(doc.address[0].use).toEqual('home');
                expect(doc.name[0].family).toEqual('Bone');
                expect(doc.name[0].given[0]).toEqual('Ronald');
                expect(doc.identifier[1].system).toEqual('http://www.acme.org/practitioners');
                expect(doc.identifier[1].value).toEqual('25456');
            });

        });

        test('testing some added search params', async () => {
          let args = { active: true, address: 'De', addressCity: 'Den',
        addressCountry: 'NLD', addressPostalCode: '2333za', addressState: 'NY',
      addressUse: 'wo', communication: 'urn:oid:2.16.840.1.113883.6.121|nl',
    email: 'm.versteegh@bmc.nl', gender: 'male', name: 'Dr. Ronald bone md', phone: '0205562431',
  telecom: '0205662948' };
          let [ err, docs ] = await asyncHandler(
            practitionerService.search(args, logger)
          );

          expect(err).toBeUndefined();
          expect(docs.length).toEqual(1);

          docs.forEach(doc => {
            expect(doc.active).toEqual(true);
            expect(doc.address[1].use).toEqual('work');
            expect(doc.address[1].city).toEqual('Den helder');
            expect(doc.address[1].country).toEqual('NLD');
            expect(doc.address[1].postalCode).toEqual('2333ZA')
            expect(doc.address[1].state).toEqual('NY');
            expect(doc.communication[0].coding[0].system).toEqual('urn:oid:2.16.840.1.113883.6.121');
            expect(doc.communication[0].coding[0].code).toEqual('nl');
            expect(doc.telecom[1].value).toEqual('m.versteegh@bmc.nl');
            expect(doc.gender).toEqual('male');
            expect(doc.name[0].suffix[0]).toEqual('MD');
            expect(doc.telecom[0].value).toEqual('0205562431');
            expect(doc.telecom[2].value).toEqual('0205662948');
          });
        });
      });

    describe('Method: searchById', () => {

        test('should correctly return a document', async () => {
            let args = {id: '0'};
            let [err, doc] = await asyncHandler(
                practitionerService.searchById(args, logger)
            );

            expect(err).toBeUndefined();
            expect(doc.id).toEqual(args.id);
        });

    });

    describe('Method: remove', () => {

        // For these tests, let's do it in 3 steps
        // 1. Check the practitioner exists
        // 2. Delete a practitioner and make sure it does not throw
        // 3. Check the practitioner does not exist

        test('should successfully delete a document', async () => {

            // Look for this particular fixture
            let args = { id: '0' };
            let [ err, doc ] = await asyncHandler(
                practitionerService.searchById(args, logger)
            );

            expect(err).toBeUndefined();
            expect(doc.id).toEqual(args.id);

            // Now delete this fixture
            let [ delete_err, _ ] = await asyncHandler(
                practitionerService.remove(args, logger)
            );

            // There is no response resolved from this promise, so just check for an error
            expect(delete_err).toBeUndefined();

            // Now query for the fixture again, there should be no documents
            let [ query_err, missing_doc ] = await asyncHandler(
                practitionerService.searchById(args, logger)
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
                    toJSON: () => PractitionerFixture
                },
                id: '0'
            };

            // Delete the fixture incase it exists,
            // mongo won't throw if we delete something not there
            let [ delete_err, _ ] = await asyncHandler(
                practitionerService.remove(args, logger)
            );

            expect(delete_err).toBeUndefined();

            // Create the fixture, it expects two very specific args
            // The resource arg must be a class/object with a toJSON method
            let [ create_err, create_results ] = await asyncHandler(
                practitionerService.create(args, logger)
            );

            expect(create_err).toBeUndefined();
            // Response should contain an id so core can set appropriate location headers
            expect(create_results.id).toEqual(args.id);


            // Verify the new fixture exists
            let [ query_err, doc ] = await asyncHandler(
                practitionerService.searchById(args, logger)
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
            PractitionerFixture.text.status = 'preliminary';

            let args = {
                resource: {
                    toJSON: () => PractitionerFixture
                },
                id: '0'
            };

            // Query for the original doc, this will ignore the resource arg
            let [query_err, doc] = await asyncHandler(
                practitionerService.searchById(args, logger)
            );

            expect(query_err).toBeUndefined();
            expect(doc.text.status).toEqual('generated');

            // Update the original doc
            let [update_err, update_results] = await asyncHandler(
                practitionerService.update(args, logger)
            );

            expect(update_err).toBeUndefined();
            expect(update_results.id).toEqual(args.id);

            // Query the newly updated doc and make sure the text status is correct
            let [updated_err, updated_doc] = await asyncHandler(
                practitionerService.searchById(args, logger)
            );

            expect(updated_err).toBeUndefined();
            expect(updated_doc.text.status).toEqual('preliminary');

        });

    });

});
