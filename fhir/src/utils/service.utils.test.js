const { CLIENT, CLIENT_DB } = require('../constants');
const asyncHandler = require('../lib/async-handler');
const logger = require('../testutils/logger.mock');
const organizationService = require('../services/organization/organization.service');
const patientService = require('../services/patient/patient.service');
const { mongoConfig } = require('../config');
const mongoClient = require('../lib/mongo');
let globals = require('../globals');
const { numberQueryBuilder, quantityQueryBuilder, compositeQueryBuilder, dateQueryBuilder } = require('./service.utils');

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

            // required system
            args = {email: 'p.heuvel@gmail.com'};
            [err, docs] = await asyncHandler(
                patientService.search(args, logger)
            );
            expect(err).toBeUndefined();
            expect(docs.length).toEqual(1);
            expect(docs[0].telecom[4].value).toEqual('p.heuvel@gmail.com');

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

    describe('Method: addressQueryBuilder', () => {

        test('should pass back an organization based on parts of the address', async () => {
            // Handle a full address
            let args = {address: '3300 Washtenaw Avenue, Suite 227, Ann Arbor, MI  48104 UsA'};
            let [err, docs] = await asyncHandler(
                organizationService.search(args, logger)
            );
            expect(err).toBeUndefined();
            expect(docs.length).toEqual(1);

            // Handle Line and Country with weird case
            args = {address: '3300 WAshtenaw Avenue, Suite 227          ,,,,,,,,,     ,MI'};
            [err, docs] = await asyncHandler(
                organizationService.search(args, logger)
            );
            expect(err).toBeUndefined();
            expect(docs.length).toEqual(1);

            // Should not handle spelling errors
            args = {address: '3300 Washtenaw Avenue, Sute 227, Ann Arbor, MI  48104 UsA'};
            [err, docs] = await asyncHandler(
                organizationService.search(args, logger)
            );
            expect(err).toBeUndefined();
            expect(docs.length).toEqual(0);

            // Find all orgs in the US (should match USA too)
            args = {address: 'Us'};
            [err, docs] = await asyncHandler(
                organizationService.search(args, logger)
            );
            expect(err).toBeUndefined();
            expect(docs.length).toEqual(2);

        });

    });

    describe('Method: nameQueryBuilder', () => {

        test('should pass back a name based on parts of it', async () => {
            // Handle a full address
            let args = {name: 'Peter James Chalmers'};
            let [err, docs] = await asyncHandler(
                patientService.search(args, logger)
            );
            expect(err).toBeUndefined();
            expect(docs.length).toEqual(1);

            // Handle multiple last names regardless of order
            args = {name: 'Windsor          ,,,,,,,,,     . Chalmers'};
            [err, docs] = await asyncHandler(
                patientService.search(args, logger)
            );
            expect(err).toBeUndefined();
            expect(docs.length).toEqual(1);

            // Should not handle spelling errors
            args = {name: 'Peter James Calmers'};
            [err, docs] = await asyncHandler(
                patientService.search(args, logger)
            );
            expect(err).toBeUndefined();
            expect(docs.length).toEqual(0);

        });

    });

    describe('Method: numberQueryBuilder', () => {

        test('should pass back a query based on a prefix', async () => {
            let query = numberQueryBuilder('lt12');
            expect(query).toEqual({$lt: 12});

            query = numberQueryBuilder('le12');
            expect(query).toEqual({$lte: 12});

            query = numberQueryBuilder('gt12');
            expect(query).toEqual({$gt: 12});

            query = numberQueryBuilder('ge12');
            expect(query).toEqual({$gte: 12});

            query = numberQueryBuilder('ne12');
            expect(query).toEqual({$ne: 12});

        });

        test('should pass back an approximation query', async () => {
            let query = numberQueryBuilder('100');
            expect(query).toEqual({$gte: 99.5, $lt: 100.5});

            query = numberQueryBuilder('100.00');
            expect(query).toEqual({$gte: 99.995, $lt: 100.005});

        });

    });

    describe('Method: quantityQueryBuilder', () => {

        test('should pass back a query based on a prefix', async () => {
            let query = quantityQueryBuilder('lt12||mm', 'example');
            expect(query).toEqual({'example.code': 'mm', 'example.value': {$lt: 12}});

            query = quantityQueryBuilder('le12||mm', 'example');
            expect(query).toEqual({'example.code': 'mm', 'example.value': {$lte: 12}});

            query = quantityQueryBuilder('gt12||mm', 'example');
            expect(query).toEqual({'example.code': 'mm', 'example.value': {$gt: 12}});

            query = quantityQueryBuilder('ge12||mm', 'example');
            expect(query).toEqual({'example.code': 'mm', 'example.value': {$gte: 12}});

            query = quantityQueryBuilder('ne12||mm', 'example');
            expect(query).toEqual({'example.code': 'mm', 'example.value': {$ne: 12}});

        });

        test('should pass the default query', async () => {
            let query = quantityQueryBuilder('12||mm', 'example');
            expect(query).toEqual({'example.code': 'mm', 'example.value': 12});

        });

    });

    describe('Method: dateQueryBuilder', () => {

        test('should correctly return the query for each type of date with standard input', async () => {
            let query = dateQueryBuilder('2014-06-03', 'date', '');
            expect(query).toEqual({'$regex': /^(?:2014-06-03)|(?:2014$)|(?:2014-06$)|(?:2014-06-03$)/i});

            query = dateQueryBuilder('2014-06-03T05:25Z', 'dateTime', '');
            expect(query).toEqual({'$regex': /^(?:2014-06-03T05:25)|(?:2014-06-03T05:25Z)|(?:2014$)|(?:2014-06$)|(?:2014-06-03$)|(?:2014-06-03T05:25Z?$)/i});

            query = dateQueryBuilder('2014-06-03T04:33:24', 'instant', '');
            expect(query).toEqual({'$regex': /^(?:2014-06-03T04:33:24)|(?:2014-06-03T04:33:24)|(?:2014$)|(?:2014-06$)|(?:2014-06-03$)|(?:2014-06-03T04:33Z?$)/i});

            query = dateQueryBuilder('2014-06-03', 'period', 'samplePeriod.test');
            expect(query).toEqual([{'$and': [{'samplePeriod.test.start': {'$lte': '2014-06-03Z'}}, {'samplePeriod.test.end': {'$gte': '2014-06-03Z'}}]}, {'$and': [{'samplePeriod.test.start': {'$lte': '2014-06-03Z'}}, {'samplePeriod.test.end': undefined}]}, {'$and': [{'samplePeriod.test.end': {'$gte': '2014-06-03Z'}}, {'samplePeriod.test.start': undefined}]}]);

            query = dateQueryBuilder('2015-06-04T00:00', 'timing', 'sampleTiming.test');
            expect(query).toEqual( [{'sampleTiming.test.event': {'$regex': /^(?:2015-06-04T00:00)|(?:2015-06-04T00:00)|(?:2015$)|(?:2015-06$)|(?:2015-06-04$)|(?:2015-06-04T00:00Z?$)/i}}, {'$and': [{'sampleTiming.test.repeat.boundsPeriod.start': {'$lte': '2015-06-04T00:00'}}, {'sampleTiming.test.repeat.boundsPeriod.end': {'$gte': '2015-06-04T00:00'}}]}, {'$and': [{'sampleTiming.test.repeat.boundsPeriod.start': {'$lte': '2015-06-04T00:00'}}, {'sampleTiming.test.repeat.boundsPeriod.end': undefined}]}, {'$and': [{'sampleTiming.test.repeat.boundsPeriod.end': {'$gte': '2015-06-04T00:00'}}, {'sampleTiming.test.repeat.boundsPeriod.start': undefined}]}]);

        });

        test('testing other inputs with date', async() => {
          let query = dateQueryBuilder('2014', 'date', ''); //just year
          expect(query).toEqual({'$regex': /^(?:2014)|(?:2014$)|(?:undefined)|(?:undefined)/i});

          query = dateQueryBuilder('30', 'date', ''); //invalid input
          expect(query).toEqual(undefined);

          query = dateQueryBuilder('2014-06', 'date', ''); //just year and month
          expect(query).toEqual({'$regex': /^(?:2014-06)|(?:2014$)|(?:2014-06$)|(?:undefined)/i});

          query = dateQueryBuilder('2014-06-03T00:05', 'date', ''); //extra time input
          expect(query).toEqual({'$regex': /^(?:2014-06-03)|(?:2014$)|(?:2014-06$)|(?:2014-06-03$)/i});

          query = dateQueryBuilder('2014-06-03T00:30-03:00', 'date', ''); //extra time zone input
          expect(query).toEqual({'$regex': /^(?:2014-06-03)|(?:2014$)|(?:2014-06$)|(?:2014-06-03$)/i});

          //not sure if below is supposed to be implemented like this - is date supposed to consider time zones or not look at them at all?
          query = dateQueryBuilder('2014-06-04T00:30+03:00', 'date', '');
          expect(query).toEqual({'$regex': /^(?:2014-06-04)|(?:2014$)|(?:2014-06$)|(?:2014-06-04$)/i});
        });

        test('testing other inputs to dateTime', async() => {
          let query = dateQueryBuilder('2014', 'dateTime', ''); //just year
          expect(query).toEqual({'$regex': /^(?:2014)|(?:2014)|(?:2014$)/i});

          query = dateQueryBuilder('30', 'dateTime', ''); //invalid input
          expect(query).toEqual(undefined);

          query = dateQueryBuilder('2014-06', 'dateTime', ''); //just year and month
          expect(query).toEqual({'$regex': /^(?:2014-06)|(?:2014-06)|(?:2014$)|(?:2014-06$)/i});

          query = dateQueryBuilder('2014-06-03T00:05', 'dateTime', ''); //basic time input
          expect(query).toEqual({'$regex': /^(?:2014-06-03T00:05)|(?:2014-06-03T00:05)|(?:2014$)|(?:2014-06$)|(?:2014-06-03$)|(?:2014-06-03T00:05Z?$)/i});

          query = dateQueryBuilder('2014-06-03T00:30-03:00', 'dateTime', ''); //time zone
          expect(query).toEqual({'$regex': /^(?:2014-06-03T03:30)|(?:2014-06-03T00:30-03:00)|(?:2014$)|(?:2014-06$)|(?:2014-06-03$)|(?:2014-06-03T03:30Z?$)|(?:^$)|(?:2014-06-03$)/i});

          query = dateQueryBuilder('2014-06-03T00:30+03:00', 'dateTime', ''); //time zone with day change
          expect(query).toEqual({'$regex': /^(?:2014-06-02T21:30)|(?:2014-06-03T00:30\+03:00)|(?:2014$)|(?:2014-06$)|(?:2014-06-02$)|(?:2014-06-02T21:30Z?$)|(?:^$)|(?:2014-06-02$)/i});

          query = dateQueryBuilder('2014-06-03T00:40:44-04:00', 'dateTime', ''); //seconds with time zone
          expect(query).toEqual({'$regex': /^(?:2014-06-03T04:40:44)|(?:2014-06-03T00:40:44-04:00)|(?:2014$)|(?:2014-06$)|(?:2014-06-03$)|(?:2014-06-03T04:40Z?$)|(?:2014-06-03T04:40:44Z?$)|(?:2014-06-03$)/i});

          query = dateQueryBuilder('2014-12-31T23:29-03:31', 'dateTime', ''); //time zone day, month, year change
          expect(query).toEqual({'$regex': /^(?:2015-01-01T03:00)|(?:2014-12-31T23:29-03:31)|(?:2015$)|(?:2015-01$)|(?:2015-01-01$)|(?:2015-01-01T03:00Z?$)|(?:^$)|(?:2015-01-01$)/i});
        });

        test('testing other inputs to instant', async() => {
          let query = dateQueryBuilder('2014', 'instant', ''); //just year
          expect(query).toEqual({'$regex': /^(?:2014)|(?:2014)|(?:2014$)/i});

          query = dateQueryBuilder('30', 'instant', ''); //invalid input
          expect(query).toEqual(undefined);

          query = dateQueryBuilder('2014-06', 'instant', ''); //just year and month
          expect(query).toEqual({'$regex': /^(?:2014-06)|(?:2014-06)|(?:2014$)|(?:2014-06$)/i});

          query = dateQueryBuilder('2014-06-03T00:05', 'instant', ''); //basic time input
          expect(query).toEqual({'$regex': /^(?:2014-06-03T00:05)|(?:2014-06-03T00:05)|(?:2014$)|(?:2014-06$)|(?:2014-06-03$)|(?:2014-06-03T00:05Z?$)/i});

          query = dateQueryBuilder('2014-06-03T00:30-03:00', 'instant', ''); //time zone
          expect(query).toEqual({'$regex': /^(?:2014-06-03T03:30)|(?:2014-06-03T00:30-03:00)|(?:2014$)|(?:2014-06$)|(?:2014-06-03$)|(?:2014-06-03T03:30Z?$)|(?:^$)|(?:2014-06-03$)/i});

          query = dateQueryBuilder('2014-06-03T00:30+03:00', 'instant', ''); //time zone with day change
          expect(query).toEqual({'$regex': /^(?:2014-06-02T21:30)|(?:2014-06-03T00:30\+03:00)|(?:2014$)|(?:2014-06$)|(?:2014-06-02$)|(?:2014-06-02T21:30Z?$)|(?:^$)|(?:2014-06-02$)/i});

          query = dateQueryBuilder('2014-06-03T00:40:44-04:00', 'instant', ''); //seconds with time zone
          expect(query).toEqual({'$regex': /^(?:2014-06-03T04:40:44)|(?:2014-06-03T00:40:44-04:00)|(?:2014$)|(?:2014-06$)|(?:2014-06-03$)|(?:2014-06-03T04:40Z?$)|(?:2014-06-03T04:40:44Z?$)|(?:2014-06-03$)/i});

          query = dateQueryBuilder('2014-12-31T23:29-03:31', 'instant', ''); //time zone day, month, year change
          expect(query).toEqual({'$regex': /^(?:2015-01-01T03:00)|(?:2014-12-31T23:29-03:31)|(?:2015$)|(?:2015-01$)|(?:2015-01-01$)|(?:2015-01-01T03:00Z?$)|(?:^$)|(?:2015-01-01$)/i});
        });

        test('testing other inputs to period', async () => {
          let query = dateQueryBuilder('2014', 'period', 'samp.sPeriod'); //just year
          expect(query).toEqual([{'$and': [{'samp.sPeriod.start': {'$lte': '2014Z'}}, {'samp.sPeriod.end': {'$gte': '2014Z'}}]}, {'$and': [{'samp.sPeriod.start': {'$lte': '2014Z'}}, {'samp.sPeriod.end': undefined}]}, {'$and': [{'samp.sPeriod.end': {'$gte': '2014Z'}}, {'samp.sPeriod.start': undefined}]}]);

          query = dateQueryBuilder('2014-06', 'period', 'samp.sPeriod'); //just year and month
          expect(query).toEqual([{'$and': [{'samp.sPeriod.start': {'$lte': '2014-06Z'}}, {'samp.sPeriod.end': {'$gte': '2014-06Z'}}]}, {'$and': [{'samp.sPeriod.start': {'$lte': '2014-06Z'}}, {'samp.sPeriod.end': undefined}]}, {'$and': [{'samp.sPeriod.end': {'$gte': '2014-06Z'}}, {'samp.sPeriod.start': undefined}]}]);

          query = dateQueryBuilder('2014-06-03T00:05', 'period', 'samp.sPeriod'); //time input
          expect(query).toEqual([{'$and': [{'samp.sPeriod.start': {'$lte': '2014-06-03T00:05Z'}}, {'samp.sPeriod.end': {'$gte': '2014-06-03T00:05Z'}}]}, {'$and': [{'samp.sPeriod.start': {'$lte': '2014-06-03T00:05Z'}}, {'samp.sPeriod.end': undefined}]}, {'$and': [{'samp.sPeriod.end': {'$gte': '2014-06-03T00:05Z'}}, {'samp.sPeriod.start': undefined}]}]);

          query = dateQueryBuilder('2014-06-03T00:30-03:00', 'period', 'samp.sPeriod'); // time zone
          expect(query).toEqual([{'$and': [{'samp.sPeriod.start': {'$lte': '2014-06-03T03:30Z'}}, {'samp.sPeriod.end': {'$gte': '2014-06-03T03:30Z'}}]}, {'$and': [{'samp.sPeriod.start': {'$lte': '2014-06-03T03:30Z'}}, {'samp.sPeriod.end': undefined}]}, {'$and': [{'samp.sPeriod.end': {'$gte': '2014-06-03T03:30Z'}}, {'samp.sPeriod.start': undefined}]}]);

          query = dateQueryBuilder('2014-06-03T00:30+03:00', 'period', 'samp.sPeriod'); //time zone day change
          expect(query).toEqual([{'$and': [{'samp.sPeriod.start': {'$lte': '2014-06-02T21:30Z'}}, {'samp.sPeriod.end': {'$gte': '2014-06-02T21:30Z'}}]}, {'$and': [{'samp.sPeriod.start': {'$lte': '2014-06-02T21:30Z'}}, {'samp.sPeriod.end': undefined}]}, {'$and': [{'samp.sPeriod.end': {'$gte': '2014-06-02T21:30Z'}}, {'samp.sPeriod.start': undefined}]}]);

          query = dateQueryBuilder('2014-06-03T00:40:44-04:00', 'period', 'samp.sPeriod'); //seconds
          expect(query).toEqual([{'$and': [{'samp.sPeriod.start': {'$lte': '2014-06-03T04:40:44Z'}}, {'samp.sPeriod.end': {'$gte': '2014-06-03T04:40:44Z'}}]}, {'$and': [{'samp.sPeriod.start': {'$lte': '2014-06-03T04:40:44Z'}}, {'samp.sPeriod.end': undefined}]}, {'$and': [{'samp.sPeriod.end': {'$gte': '2014-06-03T04:40:44Z'}}, {'samp.sPeriod.start': undefined}]}]);

          query = dateQueryBuilder('2014-12-31T23:29-03:31', 'period', 'samp.sPeriod'); //time zone day, month, year change
          expect(query).toEqual([{'$and': [{'samp.sPeriod.start': {'$lte': '2015-01-01T03:00Z'}}, {'samp.sPeriod.end': {'$gte': '2015-01-01T03:00Z'}}]}, {'$and': [{'samp.sPeriod.start': {'$lte': '2015-01-01T03:00Z'}}, {'samp.sPeriod.end': undefined}]}, {'$and': [{'samp.sPeriod.end': {'$gte': '2015-01-01T03:00Z'}}, {'samp.sPeriod.start': undefined}]}]);

        });
        // test('should pass the default query', async () => {
        //     let query = quantityQueryBuilder('12||mm', 'example');
        //     expect(query).toEqual({'example.code': 'mm', 'example.value': 12});
        //
        // });

    });

    describe('Method: compositeQueryBuilder', () => {

        test('should pass the each query type', async () => {
            // Token and string
            let query = compositeQueryBuilder('http://foo.org|3$bar5', 'code.coding|token', 'valueString|string');
            expect(query).toEqual({'$and': [{'$or': [{'$and': [{'code.coding.code': '3', 'code.coding.system': 'http://foo.org'}]}, {'$and': [{'code.coding.system': 'http://foo.org', 'code.coding.value': '3'}]}]}, {'valueString': {'$regex': /^bar5/i}}]});

            // Reference and quantity
            query = compositeQueryBuilder('Encounter/example$60||mm', 'foo.reference|reference', 'bar|quantity');
            expect(query).toEqual({$and: [{'foo.reference': 'Encounter/example'}, {'bar.code': 'mm', 'bar.value': 60}]});

            // Number and code
            query = compositeQueryBuilder('lt12$example', 'foo|number', 'bar|code');
            expect(query).toEqual({$and: [{'foo': {$lt: 12}}, {'bar': 'example'}]});

        });

        test('should pass an or', async () => {
            let query = compositeQueryBuilder('http://foo.org|3,bar5', 'code.coding|token', 'valueString|string');
            expect(query).toEqual({'$or': [{'$or': [{'$and': [{'code.coding.code': '3', 'code.coding.system': 'http://foo.org'}]}, {'$and': [{'code.coding.system': 'http://foo.org', 'code.coding.value': '3'}]}]}, {'valueString': {'$regex': /^bar5/i}}]});

        });

    });

});
