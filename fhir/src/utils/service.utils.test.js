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
            let args = {name: 'name?Health'};
            let [err, docs] = await asyncHandler(
                organizationService.search(args, logger)
            );
            expect(err).toBeUndefined();
            expect(docs.length).toEqual(1);
            expect(docs[0].name).toEqual('Health Level Seven International');

            // given name case
            args = {name: 'name?given=health'};
            [err, docs] = await asyncHandler(
                organizationService.search(args, logger)
            );
            expect(err).toBeUndefined();
            expect(docs.length).toEqual(1);
            expect(docs[0].name).toEqual('Health Level Seven International');

            // contains name case
            args = {name: 'name?given:contains=EvEn'};
            [err, docs] = await asyncHandler(
                organizationService.search(args, logger)
            );
            expect(err).toBeUndefined();
            expect(docs.length).toEqual(1);
            expect(docs[0].name).toEqual('Health Level Seven International');

            // exact name case
            args = {name: 'name?given:exact=Health Level Seven International'};
            [err, docs] = await asyncHandler(
                organizationService.search(args, logger)
            );
            expect(err).toBeUndefined();
            expect(docs.length).toEqual(1);
            expect(docs[0].name).toEqual('Health Level Seven International');

            // Default alias case
            args = {name: 'alias?A'};
            [err, docs] = await asyncHandler(
                organizationService.search(args, logger)
            );
            expect(err).toBeUndefined();
            expect(docs.length).toEqual(1);
            expect(docs[0].alias[1]).toEqual('A good test');

            // given alias case
            args = {name: 'alias?given=A G'};
            [err, docs] = await asyncHandler(
                organizationService.search(args, logger)
            );
            expect(err).toBeUndefined();
            expect(docs.length).toEqual(1);
            expect(docs[0].alias[1]).toEqual('A good test');

            // contains alias case
            args = {name: 'alias?given:contains=s'};
            [err, docs] = await asyncHandler(
                organizationService.search(args, logger)
            );
            expect(err).toBeUndefined();
            expect(docs.length).toEqual(1);
            expect(docs[0].alias[0]).toEqual('HLSI');
            expect(docs[0].alias[1]).toEqual('A good test');

            // exact alias case
            args = {name: 'alias?given:exact=HLSI'};
            [err, docs] = await asyncHandler(
                organizationService.search(args, logger)
            );
            expect(err).toBeUndefined();
            expect(docs.length).toEqual(1);
            expect(docs[0].alias[0]).toEqual('HLSI');

        });

    });

});
