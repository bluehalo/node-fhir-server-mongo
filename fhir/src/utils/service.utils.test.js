const { CLIENT, CLIENT_DB } = require('../constants');
const asyncHandler = require('../lib/async-handler');
const logger = require('../testutils/logger.mock');
const organizationService = require('../services/organization/organization.service');
const { mongoConfig } = require('../config');
const mongoClient = require('../lib/mongo');
let globals = require('../globals');

describe('Service Utils Tests', () => {

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

    describe('Method: stringQueryBuilder', () => {

        test('should pass back the correct company based on portions of the name or alias', async () => {
            // Default name case
            let args = {name: 'HeaLth'};
            let [err, docs] = await asyncHandler(
                organizationService.search(args, logger)
            );
            expect(err).toBeUndefined();
            expect(docs.length).toEqual(1);
            expect(docs[0].name).toEqual('Health Level Seven International');

            // // contains name case
            // args = {name: 'name:contains=EvEn'};
            // [err, docs] = await asyncHandler(
            //     organizationService.search(args, logger)
            // );
            // expect(err).toBeUndefined();
            // expect(docs.length).toEqual(1);
            // expect(docs[0].name).toEqual('Health Level Seven International');
            //
            // // exact name case
            // args = {name: 'name:exact=Health Level Seven International'};
            // [err, docs] = await asyncHandler(
            //     organizationService.search(args, logger)
            // );
            // expect(err).toBeUndefined();
            // expect(docs.length).toEqual(1);
            // expect(docs[0].name).toEqual('Health Level Seven International');

            // Default alias case
            args = {name: 'A gO'};
            [err, docs] = await asyncHandler(
                organizationService.search(args, logger)
            );
            expect(err).toBeUndefined();
            expect(docs.length).toEqual(1);
            expect(docs[0].alias[1]).toEqual('A good test');

            // // contains alias case
            // args = {name: 'alias:contains=s'};
            // [err, docs] = await asyncHandler(
            //     organizationService.search(args, logger)
            // );
            // expect(err).toBeUndefined();
            // expect(docs.length).toEqual(1);
            // expect(docs[0].alias[0]).toEqual('HLSI');
            // expect(docs[0].alias[1]).toEqual('A good test');
            //
            // // exact alias case
            // args = {name: 'alias:exact=HLSI'};
            // [err, docs] = await asyncHandler(
            //     organizationService.search(args, logger)
            // );
            // expect(err).toBeUndefined();
            // expect(docs.length).toEqual(1);
            // expect(docs[0].alias[0]).toEqual('HLSI');

        });

    });

    describe('Method: tokenQueryBuilder', () => {

        test('should pass back the correct company based on portions of identifier', async () => {
            // system|code
            let args = {identifier: 'http://hl7.org.fhir/sid/us-npi|1144221847'};
            let [err, docs] = await asyncHandler(
                organizationService.search(args, logger)
            );
            expect(err).toBeUndefined();
            expect(docs.length).toEqual(2);
            expect(docs[0].identifier[0].system).toEqual('http://hl7.org.fhir/sid/us-npi');
            expect(docs[0].identifier[0].value).toEqual('1144221847');

            // system|
            args = {identifier: 'http://hl7.org.fhir/sid/us-npi|'};
            [err, docs] = await asyncHandler(
                organizationService.search(args, logger)
            );
            expect(err).toBeUndefined();
            expect(docs.length).toEqual(2);
            expect(docs[0].identifier[0].system).toEqual('http://hl7.org.fhir/sid/us-npi');

            // |code
            args = {identifier: '|1144221847'};
            [err, docs] = await asyncHandler(
                organizationService.search(args, logger)
            );
            expect(err).toBeUndefined();
            expect(docs.length).toEqual(2);
            expect(docs[0].identifier[0].value).toEqual('1144221847');

            // code
            args = {identifier: '1144221847'};
            [err, docs] = await asyncHandler(
                organizationService.search(args, logger)
            );
            expect(err).toBeUndefined();
            expect(docs.length).toEqual(2);
            expect(docs[0].identifier[0].value).toEqual('1144221847');

        });

        test('should handle codeable concepts', async () => {
            // system|code
            let args = {type: 'http://hl7.org/fhir/organization-type|prov'};
            let [err, docs] = await asyncHandler(
                organizationService.search(args, logger)
            );
            expect(err).toBeUndefined();
            expect(docs.length).toEqual(2);
            expect(docs[0].type[0].coding[0].system).toEqual('http://hl7.org/fhir/organization-type');
            expect(docs[0].type[0].coding[0].code).toEqual('prov');

        });

    });

    describe('Method: referenceQueryBuilder', () => {

        test('should pass back the correct careplan based on the performer', async () => {
            // url
            let args = {partof: 'https://foo.com/fhir/Organization/1'};
            let [err, docs] = await asyncHandler(
                organizationService.search(args, logger)
            );
            expect(err).toBeUndefined();
            expect(docs.length).toEqual(1);
            expect(docs[0].partOf.reference).toEqual('Organization/1');

            // type/id
            args = {partof: 'Organization/1'};
            [err, docs] = await asyncHandler(
                organizationService.search(args, logger)
            );
            expect(err).toBeUndefined();
            expect(docs.length).toEqual(1);
            expect(docs[0].partOf.reference).toEqual('Organization/1');

            // id
            args = {partof: '1'};
            [err, docs] = await asyncHandler(
                organizationService.search(args, logger)
            );
            expect(err).toBeUndefined();
            expect(docs.length).toEqual(1);
            expect(docs[0].partOf.reference).toEqual('Organization/1');

        });

    });

});
